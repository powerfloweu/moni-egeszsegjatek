export type Activity = {
  id: string;
  name: string;
  description: string;
};

export const activities: Activity[] = [
  {
    id: "walk-street",
    name: "Séta az utcán",
    description: "Laza 5-10 perces séta a ház körül, kényelmes tempóban.",
  },
  {
    id: "indoor-bike",
    name: "Szobabicikli",
    description: "5-10 perc könnyű tekerés, alacsony ellenállással.",
  },
  {
    id: "physio",
    name: "Gyógytorna",
    description: "Rövid, kontrollált gyógytorna-blokk a megszokott gyakorlatsorral.",
  },
  {
    id: "gardening",
    name: "Kertészkedés (szobanövények)",
    description: "5-10 perc növényápolás: locsolás, levelek áttörlése, igazítás.",
  },
  {
    id: "light-mobility",
    name: "Könnyű mobilizálás/átmozgatás",
    description: "Fej- és vállkörzés, könyök- és csuklómozgások, óvatos átmozgatás.",
  },
  {
    id: "stretching",
    name: "Nyújtás",
    description: "5-10 perc finom nyújtás: combhajlító, vádli, mellkas és hát.",
  },
  {
    id: "stairs",
    name: "Lépcsőzés lassan (kapaszkodva)",
    description: "Pár perc óvatos lépcsőzés korláttal, megállásokkal.",
  },
  {
    id: "balance",
    name: "Egyensúlygyakorlat kapaszkodva",
    description: "Állás egy lábon kapaszkodva, lassú sarok-lábujj váltás, biztonságra figyelve.",
  },
  {
    id: "house-focus",
    name: "Könnyű házimunka fókusz",
    description: "5-10 perc rendrakás egy polcon vagy felületen, óvatos hajolással.",
  },
  {
    id: "breath-neck",
    name: "Légzőgyakorlat + váll/nyak",
    description: "Mély hasi légzés, lassú vállkörzés és nyaklazítás, kényelmesen.",
  },
  {
    id: "arm-shoulder-circles",
    name: "Kar- és vállkörzés",
    description: "Laza kar-lengések és vállkörzések 5-10 percen át, fájdalommentes tartományban.",
  },
  {
    id: "ankle-toe",
    name: "Bokakörzés és lábujjhegy",
    description: "Bokakörzés ülve, majd óvatos lábujjhegyre emelkedés kapaszkodva.",
  },
  {
    id: "wall-sit-light",
    name: "Fal melletti guggolás röviden",
    description: "Nagyon rövid fal melletti guggolások vagy mini-támasz, csak kényelmes tartományban.",
  },
  {
    id: "sun-salute-light",
    name: "Jógás napüdvözlet (light)",
    description: "Nagyon finom, módosított napüdvözlet vagy álló jógaszekvencia 5-8 percben.",
  },
  {
    id: "hip-mobility-seated",
    name: "Csípő mobilizálás ülve",
    description: "Ülve térd- és csípőkörzés, lassú oldalsó döntések, kényelmesen.",
  },
  {
    id: "cat-cow",
    name: "Hát nyújtás (macska-tehén)",
    description: "Asztaltartásban vagy állva lassú domborítás-homorítás 5 percig.",
  },
  {
    id: "wrist-care",
    name: "Kéz- és csuklótorna",
    description: "Csuklókörzés, ujjnyitás-zárás, puha tenyérnyomások asztalon.",
  },
  {
    id: "eye-rest",
    name: "Szem pihentetés + pislogás",
    description: "5 perc tudatos pislogás, távoli fókuszváltás, szemkörzés ülve.",
  },
  {
    id: "tiny-cleaning",
    name: "Mini takarítás egy felületen",
    description: "Egy asztallap vagy pult gyors letörlése, rendezése 5-10 percben.",
  },
  {
    id: "towel-pull",
    name: "Könnyű törölköző húzás",
    description: "Ülve törölköző húzása-lazítása kézzel, finom hát- és karaktiválás.",
  },
];

export const activitiesById: Record<string, Activity> = activities.reduce(
  (acc, activity) => {
    acc[activity.id] = activity;
    return acc;
  },
  {} as Record<string, Activity>
);

export const getActivityById = (id: string): Activity | undefined =>
  activitiesById[id];

export const getActivityForRoll = (roll: number): Activity => {
  const index = Math.max(0, Math.min(activities.length - 1, roll - 1));
  return activities[index];
};
