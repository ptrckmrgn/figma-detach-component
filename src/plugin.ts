const plugin = () => {
    let components: ComponentNode[] = [];
    let frames: FrameNode[] = [];

    const selection = figma.currentPage.selection;

    if (selection.length > 0) {
        for (const node of selection) {
            components = components.concat(getComponentNodes(node));
        }
        for (const component of components) {
            const parent = component.parent;
            const frame = createFrameFromComponent(component);
            // Rename frame and reposition in tree and on the canvas
            if (parent) {
                const index = parent.children.indexOf(component);
                parent.insertChild(index, frame);
            }
            // frame.name = component.name;
            frame.x = component.x;
            frame.y = component.y;

            // Save layer tree expanded state
            frame.setPluginData("expanded", JSON.stringify(component.expanded));

            // // Clone and position all the component children in the new frame
            // for (const child of component.children) {
            //     const newChild = child.clone();
            //     frame.appendChild(newChild);
            //     newChild.x = child.x;
            //     newChild.y = child.y;
            // }

            frame.expanded = component.expanded;
            component.remove();
            frames.push(frame);
        }

        // Report results (and set new selection)
        const count = frames.length;
        if (count > 0) {
            figma.currentPage.selection = frames;

            // Reset expanded state from saved
            for (const frame of frames) {
                frame.expanded = JSON.parse(frame.getPluginData("expanded"));
            }

            figma.notify(
                `${count} main component${
                    count > 1 ? "s" : ""
                } successfully detached`
            );
        } else {
            figma.notify("No main components found in your selection");
        }
    } else {
        figma.notify("Select a main component to detach");
    }

    figma.closePlugin();
};

const getComponentNodes = (node: SceneNode): ComponentNode[] => {
    // If node has children, traverse
    if (node.type === "COMPONENT") {
        return [node];
    } else if ("children" in node && node.children.length > 0) {
        return node.children.reduce((all: ComponentNode[], child) => {
            return all.concat(getComponentNodes(child));
        }, []);
    } else {
        return [];
    }
};

const createFrameFromComponent = (component: ComponentNode): FrameNode => {
    const instance = component.createInstance();
    const frame = instance.detachInstance();

    // // Layout-related properties (excluding position)
    // frame.rotation = component.rotation;
    // frame.resize(component.width, component.height);
    // frame.layoutAlign = component.layoutAlign;
    // frame.constraints = component.constraints;

    // // Frame properties
    // frame.clipsContent = component.clipsContent;
    // frame.guides = clone(component.guides);
    // frame.layoutGrids = clone(component.layoutGrids);
    // frame.gridStyleId = component.gridStyleId;
    // frame.layoutMode = component.layoutMode;
    // frame.counterAxisSizingMode = component.counterAxisSizingMode;
    // frame.horizontalPadding = component.horizontalPadding;
    // frame.verticalPadding = component.verticalPadding;
    // frame.itemSpacing = component.itemSpacing;

    // // Container-related properties
    // frame.expanded = component.expanded;
    // frame.backgrounds = clone(component.backgrounds);
    // frame.backgroundStyleId = component.backgroundStyleId;

    // // Geometry-related properties
    // frame.fills = clone(component.fills);
    // frame.strokes = clone(component.strokes);
    // frame.expanded = component.expanded;
    // frame.strokeWeight = component.strokeWeight;
    // frame.strokeMiterLimit = component.strokeMiterLimit;
    // frame.strokeAlign = component.strokeAlign;
    // frame.strokeCap = component.strokeCap;
    // frame.strokeJoin = component.strokeJoin;
    // frame.dashPattern = component.dashPattern;
    // frame.fillStyleId = component.fillStyleId;
    // frame.strokeStyleId = component.strokeStyleId;
    // frame.fillStyleId = component.fillStyleId;

    // // Corner-related properties
    // frame.cornerSmoothing = component.cornerSmoothing;
    // if (component.cornerRadius === figma.mixed) {
    //     frame.topLeftRadius = component.topLeftRadius;
    //     frame.topRightRadius = component.topRightRadius;
    //     frame.bottomLeftRadius = component.bottomLeftRadius;
    //     frame.bottomRightRadius = component.bottomRightRadius;
    // } else {
    //     frame.cornerRadius = component.cornerRadius;
    // }

    // // Blend-related properties
    // frame.opacity = component.opacity;
    // frame.blendMode = component.blendMode;
    // frame.isMask = component.isMask;
    // frame.effects = clone(component.effects);
    // frame.effectStyleId = component.effectStyleId;

    // // Export-related properties
    // frame.exportSettings = clone(component.exportSettings);

    // // Frame prototyping-related properties
    // frame.overflowDirection = component.overflowDirection;
    // frame.numberOfFixedChildren = component.numberOfFixedChildren;

    return frame;
};

const clone = (value: any): any => {
    return JSON.parse(JSON.stringify(value));
};

plugin();
