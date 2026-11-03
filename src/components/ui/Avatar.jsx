import { useState } from 'react';
import { getAvatarOption } from '../../data/avatars';
import { getInitials } from '../../utils/appHelpers';

const SIZES = {
  sm: { box: 'w-10 h-10', emoji: 'text-xl', text: 'text-xs' },
  md: { box: 'w-12 h-12', emoji: 'text-2xl', text: 'text-sm' },
  lg: { box: 'w-16 h-16', emoji: 'text-4xl', text: 'text-base' },
  xl: { box: 'w-32 h-32', emoji: 'text-7xl', text: 'text-3xl' },
};

// Foto se c'è, altrimenti l'animale scelto, altrimenti le iniziali.
export default function Avatar({ user, size = 'md', className = '' }) {
  const [photoBroken, setPhotoBroken] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const photo = !photoBroken && user?.avatar_url ? user.avatar_url : '';
  const animal = getAvatarOption(user?.avatar_key);

  return (
    <div
      className={`${s.box} rounded-full overflow-hidden bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt={user?.name || ''}
          className="w-full h-full object-cover"
          onError={() => setPhotoBroken(true)}
        />
      ) : animal ? (
        <span className={s.emoji}>{animal.emoji}</span>
      ) : (
        <span className={`${s.text} font-bold text-orange-700`}>{getInitials(user?.name)}</span>
      )}
    </div>
  );
}
