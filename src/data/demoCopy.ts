export type DemoCopy = {
  title: string;
  intro: string;
  loveNote: string;
  cuteMoments: string[];
};

const defaultCopy: DemoCopy = {
  title: "Will u be my Valentine?",
  intro:
    "I made this little page for you, because loving you is my favorite thing.",
  loveNote:
    "From the first hello, you have been my safest place and my biggest smile. Thank you for the way you show up, the way you listen, and the way you love. I cannot wait for our next chapter together.",
  cuteMoments: [
    "The quiet morning hugs that start everything right.",
    "Your laugh when I say something ridiculous.",
    "That look you give me when you are happy.",
  ],
};

const demoCopyByTemplateId: Record<string, DemoCopy> = {
  "cute-classic": {
    title: "Will u be my Valentine?",
    intro:
      "I made this tiny page to ask a big question and offer snacks, memes, and hugs.",
    loveNote:
      "You are my favorite notification and my favorite laugh. Say yes and I will bring the cozy blanket, the popcorn, and the best playlist.",
    cuteMoments: [
      "Your laugh when I do my dramatic voice.",
      "The way you steal my fries and smile.",
      "Our inside jokes that make no sense to anyone else.",
    ],
  },
  "midnight-muse": {
    title: "Will u be my Valentine?",
    intro: "For the nights that glow and the moments that linger, this is for you.",
    loveNote:
      "You are the spark in my late-night thoughts and the calm in my chaos. Every time I see you, the world slows down just enough to breathe.",
    cuteMoments: [
      "The car rides with the windows down.",
      "The city lights that shine brighter with you.",
      "Our last kiss before the music ended.",
    ],
  },
  "sunlit-picnic": {
    title: "Will u be my Valentine?",
    intro: "You are my sunny day, even when the clouds roll in.",
    loveNote:
      "Being with you feels like a warm breeze and a full heart. I love the way you turn simple moments into something I want to keep forever.",
    cuteMoments: [
      "The shared bites and the shared laughs.",
      "That spontaneous dance in the kitchen.",
      "The way you make every photo feel alive.",
    ],
  },
  "garden-party": {
    title: "Will u be my Valentine?",
    intro: "A little love note, wrapped in petals and soft light.",
    loveNote:
      "You make everything feel gentle and bright. Thank you for being my calm, my cheer, and my favorite bloom in every season.",
    cuteMoments: [
      "The long walks that never feel long.",
      "The tiny surprises you leave for me.",
      "The way you make home feel like home.",
    ],
  },
  "retro-love": {
    title: "Will u be my Valentine?",
    intro: "Cue the vintage soundtrack and the boldest smile.",
    loveNote:
      "You are my favorite throwback and my best right-now. With you, every day feels like a highlight reel.",
    cuteMoments: [
      "The dance breaks in the living room.",
      "The late-night snacks and silly stories.",
      "That wink that always gets me.",
    ],
  },
};

export const getDemoCopyByTemplateId = (id?: string | null) =>
  demoCopyByTemplateId[id ?? ""] ?? defaultCopy;
