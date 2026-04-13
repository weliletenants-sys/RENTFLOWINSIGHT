import { EventEmitter } from 'events';

// Initialize a singleton Global Event Dispatcher natively decoupling Modules
class DomainEventDispatcher extends EventEmitter {}

export const EventDispatcher = new DomainEventDispatcher();

// Set absolute max listeners for safety if scaling to prevent warning drops
EventDispatcher.setMaxListeners(20);

// Basic logger subscription to guarantee trace-ability 
EventDispatcher.on('payment.created', (payload) => {
    console.log(`[EVENT: payment.created] Dispatched explicitly for routing. Payload bounds:`, Object.keys(payload));
});
