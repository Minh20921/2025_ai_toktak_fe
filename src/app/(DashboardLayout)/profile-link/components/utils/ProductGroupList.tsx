'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import ProductGrid from './ProductGrid';
import { Product } from '@/app/(DashboardLayout)/profile-link/@type/interface';
import { LayoutOption } from '../const';

export default function ProductGroupList() {
  const profile = useSelector((state: RootState) => state.profile);
  const layoutType = profile.site_setting.layout_type;

  let currentUngrouped: Product[] = [];
  const renderedGrids = [];

  for (const node of profile.treeNodes) {
    if (node.type === 'product' && node.product && !profile.deletedProductIds.includes(node.product.id)) {
      currentUngrouped.push(node.product);
    } else {
      if (currentUngrouped.length > 0) {
        renderedGrids.push(
          <ProductGrid
            key={`ungrouped-${currentUngrouped.map((p) => p.id).join(',')}`}
            products={currentUngrouped}
            layoutType={layoutType}
            productBgColor={profile.site_setting.product_background_color}
            nameColor={profile.site_setting.product_name_color}
            priceColor={profile.site_setting.product_price_color}
            sectionTitle={``}
          />,
        );
        currentUngrouped = [];
      }

      if (node.type === 'group') {
        const groupProducts = (node.children || [])
          .filter(
            (child) =>
              child.type === 'product' && child.product && !profile.deletedProductIds.includes(child.product.id),
          )
          .map((child) => child.product!);

        if (groupProducts.length > 0) {
          renderedGrids.push(
            <ProductGrid
              key={`group-${node.id}`}
              products={groupProducts}
              layoutType={layoutType}
              productBgColor={profile.site_setting.product_background_color}
              nameColor={profile.site_setting.product_name_color}
              priceColor={profile.site_setting.product_price_color}
              sectionTitle={`${node.title} (${groupProducts.length})`}
              titleType={node.titleType as LayoutOption}
            />,
          );
        }
      }
    }
  }

  // Push remaining ungrouped products at the end
  if (currentUngrouped.length > 0) {
    renderedGrids.push(
      <ProductGrid
        key={`ungrouped-${currentUngrouped.map((p) => p.id).join(',')}`}
        products={currentUngrouped}
        layoutType={layoutType}
        productBgColor={profile.site_setting.product_background_color}
        nameColor={profile.site_setting.product_name_color}
        priceColor={profile.site_setting.product_price_color}
        sectionTitle={``}
      />,
    );
  }

  return <>{renderedGrids}</>;
}
