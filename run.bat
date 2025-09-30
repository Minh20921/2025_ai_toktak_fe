@echo off
REM Kéo các cập nhật mới nhất từ repository
git pull

REM Cài đặt các package cần thiết
call  npm install

REM Chạy dự án ở chế độ phát triển
call npm run dev

pause
