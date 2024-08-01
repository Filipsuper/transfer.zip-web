import { Link, useLocation, useNavigate } from "react-router-dom"
import { getFileExtension, getFileIconFromExtension, humanFileSize } from "../../utils";
import { forwardRef, useContext, useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-bootstrap";

import * as Api from "../../api/Api"
import { ApplicationContext } from "../../providers/ApplicationProvider";

export default function FilesList({ files, onAction, primaryActions, redActions, maxWidth, ignoreType, useLocationHash }) {
    const navigate = useNavigate()
    const { refreshApiTransfers } = useContext(ApplicationContext)
    const { hash, state } = useLocation()

    const [selectedPath, _setSelectedPath] = useState(useLocationHash ? decodeURIComponent(hash.slice(1)) : "")

    const setSelectedPath = (_selectedPath) => {
        if (useLocationHash) {
            navigate("#" + _selectedPath, { state })
        }
        else {
            _setSelectedPath(_selectedPath)
        }
    }

    useEffect(() => {
        if (useLocationHash) {
            _setSelectedPath(decodeURIComponent(hash.slice(1)))
        }
    }, [hash])

    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <button className="btn" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e) }}>
            <i className="bi bi-three-dots-vertical"></i>
        </button>
    ))

    const prettify = (str) => {
        return str[0].toUpperCase() + str.slice(1)
    }

    function buildNestedStructure(files) {
        if (!files) return null

        const root = { directories: [], files: [] };

        files.forEach(file => {
            const parts = (file.info.relativePath || file.info.name).split('/');
            let current = root;

            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    // This is a file, add it to the current directory's files array
                    current.files.push(file);
                } else {
                    // This is a directory
                    let dir = current.directories.find(d => d.name === part + "/");
                    if (!dir) {
                        // If the directory does not exist, create it
                        dir = { name: part + "/", directories: [], files: [] };
                        current.directories.push(dir);
                    }
                    current = dir; // Move to the found or created directory
                }
            });
        });

        return root;
    }

    const nestedStructure = useMemo(() => buildNestedStructure(files), [files])

    const FilesListEntry = ({ file }) => {
        return (
            <tr className="odd:tw-bg-dark even:tw-bg-dark-subtle tw-border-b tw-border-border  last:tw-border-b-0 hover:tw-bg-dark-secondary hover:tw-cursor-pointer" >
                <td scope="row" style={{ padding: 0 }}>
                    <Link className="list-group-item list-group-item-action p-2" onClick={e => {
                        e.preventDefault();
                        if (file.isDirectory) {
                            setSelectedPath(selectedPath + file.info.name)
                        }
                        else onAction("click", file)
                    }}>
                        {file.isDirectory ?
                            <span><i className="bi bi-folder-fill"></i> {file.info.name} <small className="ms-2 text-body-secondary">{file.info.size} files</small></span>
                            :
                            <span><i className={"bi me-1 " + getFileIconFromExtension(getFileExtension(file.info.name))}></i> <span className="text-body">{file.info.name}</span></span>
                        }
                    </Link>
                </td>
                <td>
                    <small>{humanFileSize(file.info.size, true)}</small>
                </td>
                {!ignoreType && <td className="d-none d-sm-table-cell" >
                    <small>{file.info.type}</small>
                </td>}
                <td>
                    {/* <small className="text-body-secondary">Uploading...</small> */}
                </td>
                <td className="text-end" style={{ padding: 0 }}>
                    <Dropdown>
                        {(primaryActions?.length || redActions?.length) && <Dropdown.Toggle as={CustomToggle} />}

                        <Dropdown.Menu className="text-small shadow">
                            {primaryActions?.map(action => (
                                <Dropdown.Item key={action} onClick={() => { onAction(action, file) }}>{prettify(action)}</Dropdown.Item>
                            ))}

                            {primaryActions?.length && redActions?.length && (
                                <Dropdown.Divider></Dropdown.Divider>
                            )}

                            {redActions?.length && (
                                <>
                                    {redActions.map(action => (
                                        <Dropdown.Item key={action} className="text-danger" onClick={() => { onAction(action, file) }}>
                                            {prettify(action)}
                                        </Dropdown.Item>
                                    ))}
                                </>
                            )}

                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        )
    }

    const mapEntriesFromPath = (path) => {
        const findDirectory = (current, pathParts) => {
            if (pathParts.length === 0) {
                return current
            }
            const [nextDir, ...remainingParts] = pathParts
            const foundDir = current.directories.find(dir => dir.name === nextDir + "/")

            if (foundDir) {
                return findDirectory(foundDir, remainingParts)
            }
            return null
        };
        const pathParts = path.split('/').filter(part => part)
        const targetDirectory = findDirectory(nestedStructure, pathParts)

        const returns = []
        if (targetDirectory) {
            returns.push(...targetDirectory.directories.map(dir => <FilesListEntry key={dir.name} file={{ info: { name: dir.name, size: dir.files?.length + dir.directories?.length }, isDirectory: true }} />))
            returns.push(...targetDirectory.files.map(file => <FilesListEntry key={file.info.name} file={file} />))
        }
        return returns
    }

    return (
        <div className="FilesList bg-dark tw-pb-1 tw-border tw-border-border tw-rounded-md " style={{ maxWidth: maxWidth || "unset" }}>

            <table className=" tw-w-full  " >
                <thead className=" tw-border-b tw-border-border">
                    <tr className=" tw-p-4">
                        <th className="tw-p-2">File Name</th>
                        <th className="tw-p-2">Size</th>
                        {!ignoreType && <th className="d-none d-sm-table-cell" scope="col">Type</th>}
                        <th className="tw-p-2" ></th>
                        <th  className="tw-p-2"></th>
                    </tr>
                </thead>
                <tbody className="">
                    {files.length == 0 && (
                        <tr className="tw-h-full ">
                            <td scope="row" className="bg-dark-subtle">
                                <small>No files</small>
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                        </tr>
                    )}
                    {mapEntriesFromPath(selectedPath)}
                </tbody>
            </table>
        </div>
    )
}