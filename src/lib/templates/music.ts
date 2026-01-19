export type MusicTrack = {
  id: string;
  label: string;
  src: string;
};

export const demoTracks: MusicTrack[] = [
  {
    id: "soft-piano",
    label: "Soft Piano",
    src: "/demos/audio/soft-piano.mp3",
  },
  {
    id: "dreamy-guitar",
    label: "Dreamy Guitar",
    src: "/demos/audio/dreamy-guitar.mp3",
  },
  {
    id: "lofi-heart",
    label: "Lo-fi Heart",
    src: "/demos/audio/lofi-heart.mp3",
  },
  {
    id: "starry-strings",
    label: "Starry Strings",
    src: "/demos/audio/starry-strings.mp3",
  },
];

export const getTrackById = (id?: string | null) =>
  demoTracks.find((track) => track.id === id) ?? null;
