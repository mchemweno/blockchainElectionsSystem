import styles from './AddVoters.module.css';
import {useDropzone} from "react-dropzone";
import {useCallback, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderOpen} from "@fortawesome/free-regular-svg-icons/faFolderOpen";
import {faFolder} from "@fortawesome/free-regular-svg-icons/faFolder";
import {toast, Toaster} from "react-hot-toast";
import ab2str from 'arraybuffer-to-string'
import Button from "../../ui/Button/Button";

const CSVToMatrix = (csv, delimiter) => {
    let matrix = [];
    csv.split('\n').map(l => {
        l.trim() == "" ? 0 : matrix.push(l.trim().split(delimiter).map(v => v.trim()))
    })
    return matrix
}

const MatrixToJSON = (matrix, from, to) => {
    let jsonResult = [];
    from = from || 0;
    matrix.map((a, i) => {
        let obj = Object.assign({}, ...matrix[0].map((h, index) => ({[h]: matrix[i][index]})))
        jsonResult.push(obj)
    })
    return to ? jsonResult.splice(from, to) : jsonResult.splice(from)
}

const AddVoters = ({setVisibility, voters, setVoters}) => {
    const onDrop = useCallback(acceptedFiles => {
        let csv
        try {
            acceptedFiles.forEach(acceptedFile => {
                if (acceptedFile.type !== 'text/csv') throw new Error('only csv files are allowed')
                const reader = new FileReader();

                reader.onabort = () => {
                    throw new Error('file upload aborted')
                }
                reader.onerror = () => {
                    throw new Error('file upload error')
                }

                reader.onload = () => {
                    let matrix = CSVToMatrix(ab2str(reader.result), ',')
                    let json = MatrixToJSON(matrix, 1);
                    setVoters([])
                    json.map(voter => setVoters(prevState => [...prevState, {
                        email: voter.Email
                    }]))
                }

                reader.readAsArrayBuffer(acceptedFile)
            })

        } catch (e) {
            toast.dismiss();
            toast.error(e.message);
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (
        <>
            <Toaster/>
            <div className={styles.Container}>
                {!voters ?
                    <div className={styles.uploadDiv} {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            !isDragActive ?
                                <div>
                                    <FontAwesomeIcon className={styles.FontAwesome}
                                                     icon={faFolderOpen}/>
                                    <p>Drag and drop some files here, or click to select files</p>
                                </div>
                                :
                                <div>
                                    <FontAwesomeIcon className={styles.FontAwesome}
                                                     icon={faFolder}/>
                                    <p>Drop the files here ...</p>
                                </div>
                        }
                    </div> :
                    <div className={styles.voters}>
                        <div style={{display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                            <h2>Number of Voters : {voters.length}</h2>
                        </div>
                        {voters.map((voter, index) => <p
                            key={voter.email}>{index + 1}: {voter.email}</p>)}
                    </div>}

                <div style={{display: "flex", justifyContent: 'space-between', alignItems: 'center', width: '23rem'}}>
                    <Button
                        type="button"
                        dark
                        onClick={() => setVisibility({
                            addDetails: false,
                            addParticipants: true,
                            addVoters: false,
                            summary: false
                        })}
                        // disabled={!(participants.length > 1)}
                    >
                        Back
                    </Button>
                    <Button disabled={voters === null} dark onClick={() => setVoters(null)}>Cancel</Button>
                    <Button
                        type="button"
                        dark
                        disabled={voters === null}
                        onClick={() => setVisibility({
                            addDetails: false,
                            addParticipants: false,
                            addVoters: false,
                            summary: true
                        })}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}


export default AddVoters;
