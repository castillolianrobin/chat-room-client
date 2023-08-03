import type { PusherMock } from "pusher-js-mock";

// @ts-ignore (Cypress Pusher Mock)
export const pusherMock = ()=>window.Cypress.pusher as PusherMock;
