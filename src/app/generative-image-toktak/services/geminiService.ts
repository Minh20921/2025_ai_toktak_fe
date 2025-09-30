import { GoogleGenAI, Modality, Part } from "@google/genai";

// Utility to convert a File object to a base64 string
const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            data,
            mimeType: file.type,
        },
    };
};

const WATERMARK_SVG_URL = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 25">
  <text x="0" y="20" font-family="sans-serif" font-size="20" font-weight="bold" fill="white" style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.9));">TOKTAK</text>
</svg>
`);

const applyWatermark = (base64ImageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context'));
    }

    const mainImage = new Image();
    mainImage.crossOrigin = 'anonymous';
    mainImage.onload = () => {
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;
      ctx.drawImage(mainImage, 0, 0);

      const watermark = new Image();
      watermark.crossOrigin = 'anonymous';
      watermark.onload = () => {
        // Scale watermark to be responsive to image size
        const watermarkScale = 0.15; // Watermark width will be 15% of the main image width
        const watermarkWidth = mainImage.width * watermarkScale;
        const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
        
        // Padding from the edge
        const padding = mainImage.width * 0.025;
        
        const x = mainImage.width - watermarkWidth - padding;
        const y = mainImage.height - watermarkHeight - padding;

        ctx.globalAlpha = 0.75; // Set watermark opacity
        ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.9)); // Return as JPEG for smaller file size
      };
      watermark.onerror = () => reject(new Error('Failed to load watermark image'));
      watermark.src = WATERMARK_SVG_URL;
    };
    mainImage.onerror = () => reject(new Error('Failed to load generated image for watermarking'));
    mainImage.src = base64ImageUrl;
  });
};


// Generates the detailed Korean prompt for the AI model
const getPromptForPreset = (presetId: string, imageCount: number): string => {
  const presetRules: { [key: string]: string } = {
    past_time_machine: `Generate a high-quality, hyper-realistic portrait transformation.

Core rules:
- Always show the person’s younger self.
- Preserve the same person’s facial identity with extreme accuracy (must look like the SAME individual, not someone else).
- Facial Detail: Generate realistic and detailed facial features. Pay meticulous attention to unique characteristics like eye shape, nose bridge, lip curvature, and bone structure to ensure a perfect likeness.
- Make them look more attractive than reality: smoother skin, balanced facial features, more handsome/beautiful.
- Background must be from the early 2000s (2000–2005) with film-camera tones and analog atmosphere.

Age transformation rules:
- If age appears 40 or older → transform into early 20s.
- If age appears 20–39 → transform into a mid-teen (around 15 years old).
- If age appears under 20 → transform into a toddler under 3 years old.

Guidelines:
- Identity preservation: keep same face shape, bone structure, eyes, nose, mouth.
- Do NOT generate generic teen/child faces. The result must clearly be the same person at a younger age.
- Avoid over-smoothing or airbrushing skin to the point that it obscures natural features and identity.
- Make transformations dramatic and visually obvious.
- Skin: smooth, glowing, youthful but realistic texture.
- Hair: fuller, natural youthful hairstyle.
- Clothing: casual wear suitable for the younger age group.
- Expression: lively but natural.
- Background: early 2000s setting (studio, park, or street).
- Do NOT add or invent extra people. Keep the same number of people as input.
- Resolution: at least 2048px.`,
    future_time_machine: 'future_time_machine(“미래의 우리”): 모든 가족 구성원을 +20~30년 자연 노화시켜라.',
    role_swap: 'role_swap(“역할 바꾸기”): 부모를 아이처럼, 아이를 어른처럼 표현하라.',
    disney_family: 'disney_family(“디즈니 가족”): 디즈니 애니메이션풍으로, 특정 캐릭터/로고는 복제하지 말고 오리지널 스타일로.',
    classic_art: 'classic_art(“명화 속 가족”): 반 고흐·모네 등 명화 화풍을 적용하되 특정 작품을 그대로 복제하지 말라.',
  };

  const selectedPresetRule = presetRules[presetId] || '';

  if (presetId === 'past_time_machine') {
    return selectedPresetRule; // Return the full English prompt directly
  }


  return `
[시스템 규칙]
- 작업: 업로드/촬영된 가족 사진들(${imageCount}장, 1~5장)과 단일 프리셋(${presetId})을 기반으로 고품질 합성 가족사진을 생성한다.
- 출력: 1장의 최종 이미지. 인물의 신원·관계는 입력 사진 간 일관성 유지.
- 금지: 왜곡된 얼굴/손가락/눈, 과도한 뷰티필터, 상업 IP의 로고/문구 직접 삽입.
- 후처리: 워터마크는 시스템이 삽입하므로 이미지 내용에 텍스트를 넣지 말 것.

[입력]
- 이미지들: (이미지는 API 파라미터로 제공됨)
- 프리셋: ${presetId}

[프리셋 규칙]
- ${selectedPresetRule}

[합성 지침]
1) 동일 인물의 얼굴 특징(눈, 코, 입 모양, 얼굴 골격 등)을 매우 높은 정확도로 일관성 있게 유지하고, 현실적이고 섬세한 피부 질감을 표현할 것.
2) 구도는 가족사진처럼 중앙 정렬
3) 피부·헤어·의상은 프리셋 스타일에 맞춤
4) 해상도는 2048px 이상
5) 안전: 폭력/혐오/선정적 요소 금지

[출력 형식]
- 최종 합성 이미지 1장만 반환. 설명/텍스트/워터마크 생성 금지.
`;
};


export const generateFamilyPhoto = async (files: File[], presetId: string): Promise<string> => {
  if (!process.env.NEXT_GEMINI_API_KEY) {
    alert('note key')
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY });

  const imageParts = await Promise.all(files.map(fileToGenerativePart));
  const promptText = getPromptForPreset(presetId, files.length);

  const textPart: Part = { text: promptText };

  const contents = {
      parts: [...imageParts, textPart]
  };
  
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents,
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
  });

  // Find the first image part in the response
  const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePart && imagePart.inlineData) {
      const base64ImageBytes = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      const rawImageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
      
      try {
        const watermarkedImageUrl = await applyWatermark(rawImageUrl);
        return watermarkedImageUrl;
      } catch (error) {
          console.error("Failed to apply watermark, returning original image.", error);
          return rawImageUrl; // Fallback to original image if watermarking fails
      }

  } else {
      const textResponse = response.text;
      console.error("API did not return an image. Text response:", textResponse);
      throw new Error("The AI did not return an image. It may have refused the request due to safety policies. Response: " + textResponse);
  }
};