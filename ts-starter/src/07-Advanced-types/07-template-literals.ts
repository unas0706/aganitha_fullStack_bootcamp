type Events = "click" | "hover" | "focus";

type EventHandlerNames = `on${Capitalize<Events>}`;
