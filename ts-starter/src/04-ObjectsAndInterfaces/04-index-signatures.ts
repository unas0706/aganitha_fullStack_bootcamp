interface Dictionary {
  [key: string]: string;
}

const dict: Dictionary = {
  en: "Hello",
  fr: "Bonjour",
};

// dict.count = 3;

interface FlexibleDictionary {
  [key: string]: string | number;
}

const flexDict: FlexibleDictionary = {
  en: "Hello",
  count: 3,
};
