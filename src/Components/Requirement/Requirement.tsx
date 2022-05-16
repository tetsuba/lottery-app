export default function Requirement(props: any) {
    const {passed, border} = props
    const borderStyle = border ? {'borderBottom': '#CCC solid 1px'} : {}
    const markType = passed ? 'check-mark' : 'cross-mark'

    return (
        <div className="row" style={borderStyle}>
            { passed ? props.children[0] : props.children[1] }
            <span className={markType}></span>
        </div>
    )
}
