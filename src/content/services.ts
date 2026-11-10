export type ServiceStatus = "published" | "pending";

export interface Service {
  id: string;
  name: string;
  index: string;
  short: string;
  details: string[];
  status: ServiceStatus;
}

/** Para adicionar um procedimento confirmado, inclua um item com status "published". */
export const services: Service[] = [
  {
    id: "design-sobrancelhas",
    name: "Design de sobrancelhas",
    index: "01",
    short: "Um desenho pensado para o seu rosto, respeitando a naturalidade e a expressão do seu olhar.",
    details: [
      "O desenho é definido em conjunto, considerando o formato do rosto e o que você deseja valorizar.",
      "Conte suas preferências e dúvidas — a escolha final e os cuidados são conversados diretamente com Emyli.",
    ],
    status: "published",
  },
  {
    id: "design-henna",
    name: "Design com henna",
    index: "02",
    short: "O design de sobrancelhas complementado pela henna, para um acabamento com mais definição.",
    details: [
      "A henna é aplicada após o design para realçar o desenho das sobrancelhas.",
      "A indicação e as orientações de cuidado são individuais e devem ser conversadas com a profissional.",
    ],
    status: "published",
  },
  {
    id: "brow-lamination",
    name: "Brow lamination",
    index: "03",
    short: "Técnica que alinha e organiza os fios, trazendo uma aparência mais preenchida e disciplinada.",
    details: [
      "Os fios são direcionados para criar um efeito alinhado e com volume visual.",
      "Converse com Emyli para entender se a técnica combina com você e quais cuidados seguir.",
    ],
    status: "published",
  },
  {
    id: "buco",
    name: "Buço",
    index: "04",
    short: "Aguardando confirmação da proprietária.",
    details: [],
    status: "pending",
  },
];

export const publishedServices = services.filter((s) => s.status === "published");
