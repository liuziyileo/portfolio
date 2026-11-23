function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function validHexColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
}

export function resolveSiteSettings(settingsDocument, legacyProfile) {
  const settings = settingsDocument || {};
  const legacy = legacyProfile || {};

  return {
    homeArtworkSize: clampNumber(settings.homeArtworkSize ?? legacy.homeArtworkSize, 112, 240, 164),
    boardColor: validHexColor(settings.boardColor ?? legacy.boardColor, '#b9956e'),
    backgroundSticker: settings.backgroundSticker ?? legacy.backgroundSticker ?? null,
    backgroundStickerX: clampNumber(settings.backgroundStickerX ?? legacy.backgroundStickerX, 0, 100, 88),
    backgroundStickerY: clampNumber(settings.backgroundStickerY ?? legacy.backgroundStickerY, 0, 100, 72),
    backgroundStickerRotation: clampNumber(settings.backgroundStickerRotation ?? legacy.backgroundStickerRotation, -30, 30, 8),
    categorySettings: settings.categorySettings?.length
      ? settings.categorySettings
      : legacy.categorySettings || [],
  };
}
