import { useI18n } from "@shared/i18n/useI18n";

interface RoomIdentifierProps {
  name: string;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
}

/**
 * RoomIdentifier
 *
 * A semantic component for displaying classroom names consistently.
 * It automatically adds the "Room" prefix and an optional icon.
 */
export const RoomIdentifier = ({
  name,
  className = "",
  iconClassName = "",
  showIcon = true,
}: RoomIdentifierProps) => {
  const { t } = useI18n();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {showIcon && (
        <span
          className={`material-symbols-outlined shrink-0 ${iconClassName}`}
          data-icon="meeting_room"
          aria-hidden="true"
        >
          meeting_room
        </span>
      )}
      <span className="truncate">
        <span className="mr-1">{t("common.roomLabel")}</span>
        {name}
      </span>
    </div>
  );
};
