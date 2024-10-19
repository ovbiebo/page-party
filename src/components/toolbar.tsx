import {useSlate} from "slate-react";
import {Editor as BaseEditor, Element as SlateElement, Node, Transforms} from "slate";
import {BlockquoteLeft, Code, ListOl, ListUl, TypeBold, TypeH1, TypeH2, TypeItalic} from "react-bootstrap-icons";

function Toolbar() {
    const editor = useSlate();
    return (
        <div className="bg-white h-14 flex gap-2 items-center justify-center sticky top-0 w-full z-10">
            <BlockButton format="heading-one" icon={<TypeH1 size={24}/>}/>
            <BlockButton format="heading-two" icon={<TypeH2 size={24}/>}/>
            <MarkButton format="bold" icon={<TypeBold size={24}/>}/>
            <MarkButton format="italic" icon={<TypeItalic size={24}/>}/>
            <MarkButton format="code" icon={<Code size={24}/>}/>
            <BlockButton format="block-quote" icon={<BlockquoteLeft size={24}/>}/>
            <BlockButton format="numbered-list" icon={<ListOl size={24}/>}/>
            <BlockButton format="bulleted-list" icon={<ListUl size={24}/>}/>
        </div>
    );
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

type ButtonProps = {
    format: string;
    icon: React.ReactNode;
}

const BlockButton = ({format, icon}: ButtonProps) => {
    const editor = useSlate()
    return (
        <button
            className={`btn-icon ${isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            ) ? "bg-black text-white border-none" : "bg-white"}`}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {icon}
        </button>
    )
}

const MarkButton = ({format, icon}: ButtonProps) => {
    const editor = useSlate()
    return (
        <button
            className={`btn-icon ${isMarkActive(editor, format) ? "bg-black text-white border-none" : "bg-white"}`}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </button>
    )
}

const toggleBlock = (editor: BaseEditor, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !BaseEditor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties: Partial<SlateElement>
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor: BaseEditor, format: string) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        BaseEditor.removeMark(editor, format)
    } else {
        BaseEditor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor: BaseEditor, format: string, blockType = 'type') => {
    const {selection} = editor
    if (!selection) return false

    const [match] = Array.from(
        BaseEditor.nodes(editor, {
            at: BaseEditor.unhangRange(editor, selection),
            match: (node: Node) =>
                !BaseEditor.isEditor(node) &&
                SlateElement.isElement(node) &&
                node[blockType] === format,
        })
    )

    return !!match
}

const isMarkActive = (editor: BaseEditor, format: string) => {
    const marks = BaseEditor.marks(editor)
    return marks ? marks[format] === true : false
}

export default Toolbar;
