"use client";

import {useCallback, useMemo} from "react";
import {
    createEditor,
    Descendant,
    Editor as BaseEditor,
    Element as SlateElement,
    Node,
    NodeEntry,
    Transforms,
} from "slate";
import {Editable, RenderElementProps, RenderLeafProps, Slate, withReact} from "slate-react";
import {HeadingOneElement, ParagraphElement} from "@/components/types";
import Toolbar from "@/components/toolbar";

const withLayout = (editor: BaseEditor) => {
    const {normalizeNode} = editor;

    editor.normalizeNode = ([node, path]: NodeEntry) => {
        if (path.length === 0) {
            if (editor.children.length <= 1 && BaseEditor.string(editor, [0, 0]) === "") {
                const title: HeadingOneElement = {
                    type: "heading-one",
                    children: [{text: "Untitled"}],
                };
                Transforms.insertNodes(editor, title, {
                    at: path.concat(0),
                    select: true,
                });
            }

            if (editor.children.length < 2) {
                const paragraph: ParagraphElement = {
                    type: "paragraph",
                    children: [{text: ""}],
                };
                Transforms.insertNodes(editor, paragraph, {at: path.concat(1)});
            }

            for (const [child, childPath] of Node.children(editor, path)) {
                let type: string;
                const slateIndex = childPath[0];
                const enforceType = (type: string) => {
                    if (SlateElement.isElement(child) && child.type !== type) {
                        const newProperties: Partial<SlateElement> = {type};
                        Transforms.setNodes<SlateElement>(editor, newProperties, {
                            at: childPath,
                        });
                    }
                };

                switch (slateIndex) {
                    case 0:
                        type = "heading-one";
                        enforceType(type);
                        break;
                    default:
                        break;
                }
            }
        }

        return normalizeNode([node, path]);
    };

    return editor;
};

export default function Editor() {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        [],
    );
    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
    const editor = useMemo(() => withLayout(withReact(createEditor())), []);

    return (
        <Slate editor={editor} initialValue={initialValue}>
            <Toolbar/>
            <Editable
                className="focus:outline-none mx-auto min-h-full w-full max-w-[42rem] py-10"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
            />
        </Slate>
    );
}

const Element = ({attributes, children, element}: RenderElementProps) => {
    switch (element.type) {
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return (
                <h2 {...attributes}>
                    {children}
                </h2>
            )
        case "paragraph":
            return <p {...attributes}>{children}</p>;
        case 'block-quote':
            return (
                <blockquote {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul {...attributes}>
                    {children}
                </ul>
            )
        case 'numbered-list':
            return (
                <ol {...attributes}>
                    {children}
                </ol>
            )
        case 'list-item':
            return (
                <li {...attributes}>
                    {children}
                </li>
            )
    }
};

const Leaf = ({attributes, children, leaf}: RenderLeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    return <span {...attributes}>{children}</span>
}

const initialValue: Descendant[] = [
    {
        type: "heading-one",
        children: [{text: "Page Party 🎉"}],
    },
    {
        type: "paragraph",
        children: [
            {
                text: "Basically Google Docs but with AI assistance.",
            },
        ],
    },
    {
        type: 'heading-two',
        children: [
            {text: 'This is editable '},
            {text: 'rich', bold: true},
            {text: ' text, '},
            {text: 'much', italic: true},
            {text: ' better than a '},
            {text: '<textarea>', code: true},
            {text: '!'},
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text ",
            },
            {text: 'bold', bold: true},
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{text: 'You leave your fingerprints behind, so that they know it was made by another person and that person cared. '}],
    },
    {
        type: 'heading-two',
        children: [{text: 'In Summary'}],
    },
    {
        type: "paragraph",
        children: [
            {
                text: "Here are a few key points.",
            },
        ],
    },
    {
        type: 'bulleted-list',
        children: [
            {
                type: "list-item",
                children: [{text: 'Minimal rich-text editing'}]
            },
            {
                type: "list-item",
                children: [{text: 'Collaborative AI assistance 🤖!'}]
            }
        ],
    },
    {
        type: 'heading-two',
        children: [{text: 'Things You Can Do'}],
    },
    {
        type: "paragraph",
        children: [
            {
                text: "Here are a few things to do.",
            },
        ],
    },
    {
        type: 'numbered-list',
        children: [
            {
                type: "list-item",
                children: [{text: 'Play with AI.'}]
            },
            {
                type: "list-item",
                children: [{text: 'Tweet about this.'}]
            }],
    },

    {
        type: 'block-quote',
        align: 'center',
        children: [{text: 'Try it out for yourself!'}],
    },
];