import {BaseEditor, BaseRange, Descendant, Element, Range} from "slate";
import {ReactEditor} from "slate-react";

export type BlockQuoteElement = {
    type: "block-quote";
    align?: string;
    children: Descendant[];
};

export type BulletedListElement = {
    type: "bulleted-list";
    align?: string;
    children: Descendant[];
};

export type NumberedListElement = {
    type: "numbered-list";
    align?: string;
    children: Descendant[];
};

export type CheckListItemElement = {
    type: "check-list-item";
    checked: boolean;
    children: Descendant[];
};

export type EditableVoidElement = {
    type: "editable-void";
    children: EmptyText[];
};

export type HeadingElement = {
    type: "heading";
    align?: string;
    children: Descendant[];
};

export type HeadingTwoElement = {
    type: "heading-two";
    align?: string;
    children: Descendant[];
};

export type ImageElement = {
    type: "image";
    url: string;
    children: EmptyText[];
};

export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ButtonElement = { type: "button"; children: Descendant[] };

export type BadgeElement = { type: "badge"; children: Descendant[] };

export type ListItemElement = { type: "list-item"; children: Descendant[] };

export type MentionElement = {
    type: "mention";
    character: string;
    children: CustomText[];
};

export type ParagraphElement = {
    type: "paragraph";
    align?: string;
    children: Descendant[];
};

export type HeadingOneElement = { type: "heading-one"; children: Descendant[] };

export type VideoElement = {
    type: "video";
    url: string;
    children: EmptyText[];
};

export type CodeBlockElement = {
    type: "code-block";
    language: string;
    children: Descendant[];
};

export type CodeLineElement = {
    type: "code-line";
    children: Descendant[];
};

type CustomElement =
    | BlockQuoteElement
    | BulletedListElement
    | NumberedListElement
    | CheckListItemElement
    | EditableVoidElement
    | HeadingElement
    | HeadingTwoElement
    | ImageElement
    | LinkElement
    | ButtonElement
    | BadgeElement
    | ListItemElement
    | MentionElement
    | ParagraphElement
    | HeadingOneElement
    | VideoElement
    | CodeBlockElement
    | CodeLineElement;

export type CustomText = {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    text: string;
};

export type EmptyText = {
    text: string;
};

export type CustomEditor = BaseEditor &
    ReactEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
};

declare module "slate" {
    interface CustomTypes {
        Editor: CustomEditor;
        Element: CustomElement;
        Text: CustomText | EmptyText;
        Range: BaseRange & {
            [key: string]: unknown;
        };
    }
}
