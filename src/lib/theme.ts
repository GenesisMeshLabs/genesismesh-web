export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "themechange";

/**
 * Runs before first paint (inlined in the root layout) so a stored light
 * preference never flashes dark. Dark is the default; the OS preference is
 * intentionally ignored.
 */
export const themeBootstrapScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.dataset.theme="light"}}catch(e){}`;
