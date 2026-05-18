// `https://ui-avatars.com/api/?name=${name}&size=${size}&background=random`
export const getDefaultAvatar = (name: string, size = 64, background?: string) => {
  if (background) {
    return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=${background}`;
  }
  return `https://ui-avatars.com/api/?name=${name}&size=${size}`;
};
