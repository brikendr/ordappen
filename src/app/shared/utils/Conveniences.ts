export const queryToModelOptions = (doc: any) => {
  const data = doc.data();

  return {
    id: doc.id,
    ...data
  };
};

export const backgroundColorCombo = () => {
  const data = [
    {
      backgroundImage: "~/assets/icons/background.jpg",
      color: "#FFFFFF"
    },
    {
      backgroundImage: "~/assets/icons/background-1.jpg",
      color: "#000000"
    },
    {
      backgroundImage: "~/assets/icons/background-2.jpg",
      color: "#000000"
    },
    {
      backgroundImage: "~/assets/icons/background-3.jpeg",
      color: "#000000"
    },
    {
      backgroundImage: "~/assets/icons/background-4.png",
      color: "#000000"
    },
    {
      backgroundImage: "~/assets/icons/background-5.jpg",
      color: "#000000"
    },
    {
      backgroundImage: "~/assets/icons/background-6.jpg",
      color: "#000000"
    }
  ];

  const randomIdx = Math.floor(Math.random() * data.length);

  return data[randomIdx];
};
