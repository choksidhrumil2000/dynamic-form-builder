import Editor from "../Components/EditorComponent/Editor.component";
import OutputWindow from "../Components/OutputWindow/OutputWindow.Component";

// import styles from './HomePage.module.css';

export default function HomePage(){
    return (
        <div className={`flex flex-row justify-center items-center`}>
            <div style={{
                width:'50%'
            }}>
                <Editor />
            </div>
            <div style={{
                width:'50%'
            }}>
                <OutputWindow />
            </div>
        </div>
    )
}