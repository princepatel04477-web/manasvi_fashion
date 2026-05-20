export interface DesignGroup {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  productType: "kurti" | "tunic_top";
  price: number;
  images: string[];
}

const P = "/photos";

export const kurtiDesignGroups: DesignGroup[] = [
  {
    id: "kurti-1",
    title: "Kurti Design 1",
    subtitle: "Same design in multiple colors",
    href: "/kurtis",
    productType: "kurti",
    price: 1500,
    images: [
      `${P}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`,
      `${P}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`,
      `${P}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`,
    ],
  },
  {
    id: "kurti-2",
    title: "Kurti Design 2",
    subtitle: "Same design in multiple colors",
    href: "/kurtis",
    productType: "kurti",
    price: 1500,
    images: [`${P}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`],
  },
  {
    id: "kurti-3",
    title: "Kurti Design 3",
    subtitle: "Same design in multiple colors",
    href: "/kurtis",
    productType: "kurti",
    price: 1500,
    images: [`${P}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`],
  },
];

export const tunicDesignGroups: DesignGroup[] = [
  {
    id: "tunic-1",
    title: "Tunic Design 1",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/298a7d7ca464b6cebeb9831bbc04b2b30be7f8d60df05f982bda5a28edd8cf9c.png`,
      `${P}/Gemini_Generated_Image_o7map6o7map6o7ma.png`,
    ],
  },
  {
    id: "tunic-2",
    title: "Tunic Design 2",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png`,
      `${P}/6f3b4324572536e1c644bea8fb930139f703830c3430d24d5b047a122dbb7417.png`,
      `${P}/80a8ba805434a5c22ef64bc2313ae280404e5e50c301a4cdf674d4b15ad4b233.png`,
      `${P}/94f3f6fc103aa131653afadd4cdac362e00cf2d1d796568db0627351611b10c5.png`,
      `${P}/Gemini_Generated_Image_7p370v7p370v7p37.png`,
      `${P}/f655dfe697c9665cbf991262939d41b341203af8c792f879663c652577e7c1a8.png`,
    ],
  },
  {
    id: "tunic-3",
    title: "Tunic Design 3",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png`,
      `${P}/33e487078704a681b64d3ed522344381e872d85ad370d1f7ac2c462f0ecf6fe6.png`,
      `${P}/9bb581778c2cc6cef86ace04050044b5de5c1f79cc848f23ac0750c0ad40d7fa.png`,
    ],
  },
  {
    id: "tunic-4",
    title: "Tunic Design 4",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/94e518b39edefcb348371c6f19423d43c5ff6a608d9060c90e9213b2c8fd30df.png`,
      `${P}/eaa09b74a57f958619ee031523d47e4a70b8999f5066e556febe0c05c139362e.png`,
      `${P}/ec9fac511794673e59f113d66686de499e3323184d10b72fe55da77ada9619c4.png`,
    ],
  },
  {
    id: "tunic-5",
    title: "Tunic Design 5",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/1a57ec8ae5b15aafb40257774faae515db435e4d98dc03cec0e42340e40d44ac.png`,
      `${P}/2695abdce623423aabb428d773ea217263d408c1b14f325daac1e972114e3bd3.png`,
      `${P}/8dcce96683276500c2236556084f5d2ec0b2c695b15201a77821204c1030c309.png`,
      `${P}/9734ac5480510f0d7c814c0dfc2a086593ce447ec96e6b844520dacfe40c7945.png`,
      `${P}/a989fa4d2c204c4c58698f66efe357b7008f8d05d1bf03fcf0092d833b0836fc.png`,
    ],
  },
  {
    id: "tunic-6",
    title: "Tunic Design 6",
    subtitle: "Same design in multiple colors",
    href: "/tunic-tops",
    productType: "tunic_top",
    price: 1200,
    images: [
      `${P}/80fbbfbd292675e4ae8718dcfceb5508a4dcd142263ab0ae213e89e5d89124fe.png`,
      `${P}/816c6089e5f370b4f7e924323c04f9bf9b7be89a94a0bc7ab44e32d3e2b0218e.png`,
      `${P}/c7f207181a46b01ee387c4bbf41a6d965c5475211be3b1b05f886056f3ce1072.png`,
      `${P}/cdbff740b9366871671944bf4329973cfe63cc21e60255e005182161b1542d72.png`,
      `${P}/d3339d21e82764759c48de6e70c5538ca313423a0752582698c82fe4fcb663f4.png`,
    ],
  },
];
