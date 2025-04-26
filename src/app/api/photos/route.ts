import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 폴더를 재귀적으로 탐색하는 함수
const scanDirectory = (dir: string, photos: { path: string; name: string; size: number; lastModified: Date }[]) => {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 폴더인 경우 재귀적으로 탐색
        scanDirectory(fullPath, photos);
      } else if (stat.isFile()) {
        // 파일인 경우 확장자 확인
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
          photos.push({
            path: fullPath,
            name: file,
            size: stat.size,
            lastModified: stat.mtime
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
};

export async function GET() {
  try {
    // 특정 폴더 경로
    const targetPath = 'E:\\용진S23\\DCIM\\Camera';
    
    // 결과를 저장할 배열
    const photos: { path: string; name: string; size: number; lastModified: Date }[] = [];

    // 폴더 스캔 시작
    scanDirectory(targetPath, photos);

    // 날짜순으로 정렬 (오래된 순서대로)
    photos.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());

    // 가장 오래된 사진만 반환
    const oldestPhoto = photos[0];

    return NextResponse.json({ 
      success: true, 
      photo: oldestPhoto
    });
  } catch (error) {
    console.error('Error getting photos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get photos' 
    }, { status: 500 });
  }
} 