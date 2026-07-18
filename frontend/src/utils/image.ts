export function getImageUrl(imagePath: string): string {
    const marker = "uploads/";
    const index = imagePath.indexOf(marker);
  
    if (index === -1) return "";
  
    return `${import.meta.env.VITE_BACKEND_URL}/${imagePath.substring(index)}`;
  }