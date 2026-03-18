import Shell from '../ui/Shell';
import Card from '../ui/Card';
import ActionButton from '../ui/ActionButton';
import { AVATAR_OPTIONS } from '../../data/avatars.js';

export default function BoyAvatarScreen({
  currentUser,
  selectedAvatarKey,
  setSelectedAvatarKey,
  saveAvatar,
  goBack,
}) {
  return (
    <Shell
      title="Scegli avatar"
      subtitle="Seleziona l’avatar che preferisci."
      onBack={goBack}
      currentUser={currentUser}
    >
      <div className="max-w-5xl grid gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {AVATAR_OPTIONS.map(option => {
            const isSelected = selectedAvatarKey === option.key;

            return (
              <Card
                key={option.key}
                className={isSelected ? 'border-orange-300 bg-orange-50 shadow-lg' : ''}
              >
                <button
                  type="button"
                  onClick={() => setSelectedAvatarKey(option.key)}
                  className="w-full text-center"
                >
                  <div className="text-6xl mb-3">{option.emoji}</div>
                  <div className="font-semibold">{option.label}</div>
                </button>
              </Card>
            );
          })}
        </div>

        <div className="max-w-sm">
          <ActionButton
            onClick={saveAvatar}
            className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
          >
            <div className="font-bold text-center">Salva avatar</div>
          </ActionButton>
        </div>
      </div>
    </Shell>
  );
}