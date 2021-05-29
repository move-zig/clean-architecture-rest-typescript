# Inerface Adapters Layer

This is the layer between the [Use Case Interactors](../interactors/index.md) and [Frameworks and Drivers](../frameworks/index.md) layers. Objects from the Frameworks and Drivers layers must be injected, while use case interactors and domain entities can be used directly.

In general, interface adapters abstract away the frameworks and drivers so that use case interactors have a static API to work with. They are injected into use case interactors.

If a framework or driver changes, we can subsitute a new interface adapter without having to change any use case interactors or domain objects.

## Controllers

Controllers take input from the web server and format it for use case interactors.

## Repositories

Repositories abstract away data persistence.

