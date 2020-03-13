if (figma.command === "noUI") {
    figma.showUI(__html__, { visible: false });
    figma.notify("Hello world!");
    figma.closePlugin();
}
if (figma.command === "UI") {
    figma.showUI(__html__, { width: 420, height: 420 });
}
