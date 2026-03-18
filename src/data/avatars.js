export const AVATAR_OPTIONS = [
  { key: 'fox', label: 'Volpe', emoji: '🦊' },
  { key: 'panda', label: 'Panda', emoji: '🐼' },
  { key: 'tiger', label: 'Tigre', emoji: '🐯' },
  { key: 'frog', label: 'Rana', emoji: '🐸' },
  { key: 'octopus', label: 'Polpo', emoji: '🐙' },
  { key: 'monkey', label: 'Scimmia', emoji: '🐵' },
  { key: 'koala', label: 'Koala', emoji: '🐨' },
  { key: 'lion', label: 'Leone', emoji: '🦁' },
  { key: 'dog', label: 'Cane', emoji: '🐶' },
  { key: 'cat', label: 'Gatto', emoji: '🐱' },
  { key: 'bear', label: 'Orso', emoji: '🐻' },
  { key: 'rabbit', label: 'Coniglio', emoji: '🐰' },
  { key: 'penguin', label: 'Pinguino', emoji: '🐧' },
  { key: 'owl', label: 'Gufo', emoji: '🦉' },
  { key: 'unicorn', label: 'Unicorno', emoji: '🦄' },
  { key: 'dragon', label: 'Drago', emoji: '🐲' },
  { key: 'dolphin', label: 'Delfino', emoji: '🐬' },
  { key: 'whale', label: 'Balena', emoji: '🐳' },
  { key: 'chick', label: 'Pulcino', emoji: '🐥' },
  { key: 'butterfly', label: 'Farfalla', emoji: '🦋' },
  { key: 'ladybug', label: 'Coccinella', emoji: '🐞' },
  { key: 'bee', label: 'Ape', emoji: '🐝' },
  { key: 'turtle', label: 'Tartaruga', emoji: '🐢' },
  { key: 'snail', label: 'Lumaca', emoji: '🐌' },
];

export function getAvatarOption(avatarKey) {
  return AVATAR_OPTIONS.find(option => option.key === avatarKey) || null;
}