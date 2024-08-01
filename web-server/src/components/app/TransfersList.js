import { forwardRef, useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom"

import * as Api from "../../api/Api"
// import { AuthContext } from "../../providers/AuthProvider";

import { copyTransferLink } from "../../utils"
import { ApplicationContext } from "../../providers/ApplicationProvider";

export default function TransfersList({ transfers, maxWidth }) {
    const { removeTransfer } = useContext(ApplicationContext)

    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <button className="btn" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e) }}>
            <i className="bi bi-three-dots-vertical"></i>
        </button>
    ))

    const onDeleteTransfer = (transfer) => {
        removeTransfer(transfer)
    }

    const spinner = (
        <div class="spinner-grow spinner-grow-sm text-danger me-2" role="status">
            <span class="visually-hidden">Realtime...</span>
        </div>
    )

    const TransfersListEntry = ({ transfer }) => {
        return (
            <tr className="hover:tw-bg-dark-secondary hover:tw-cursor-pointer">
                <td scope="row" style={{ padding: 0 }}>
                    <Link to={"" + transfer.id} className="list-group-item list-group-item-action p-2">
                        { transfer.isRealtime && <small className="me-2 bg-dark-subtle text-body-secondary rounded border p-1">{spinner}QUICK SHARE</small> }
                        <span className="me-2">{transfer.name || transfer.id}</span>
                        <small className="text-body-secondary">{transfer.files.length} files</small>
                    </Link>
                </td>
                <td className="text-end" style={{ padding: 0 }}>
                    {/* <small className="text-body-secondary">2024-01-02 10:23:45</small> */}
                    <button className="btn" onClick={() => copyTransferLink(transfer)}><i className="bi bi-link"></i></button>
                </td>
                <td className="text-end" style={{ padding: 0, width: "0" }}>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} />

                        <Dropdown.Menu className="text-small shadow">
                            <Dropdown.Item onClick={() => copyTransferLink(transfer)}>Copy link</Dropdown.Item>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item className="text-danger" onClick={() => onDeleteTransfer(transfer)}>
                                Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        )
    }

    return (
        <div className="TransfersList bg-dark tw-pb-1 tw-border tw-border-border tw-rounded-md " style={{ maxWidth: maxWidth || "unset"}}>
            <table className="tw-w-full">
                <thead className=" tw-border-b tw-border-border" >
                    <tr className=" tw-p-4">
                        <th className="tw-p-2">Transfer Name</th>
                        <th className="tw-p-2"></th>
                        <th className="tw-p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.length == 0 && (
                        <tr className="tw-h-full ">
                            <td className="bg-dark-subtle">
                                <small>No transfers</small>
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                            <td className="bg-dark-subtle">
                            </td>
                        </tr>
                    )}
                    {transfers.map(t => {
                        return <TransfersListEntry key={t.id} transfer={t} />
                    })}
                </tbody>
            </table>
        </div>
    )
}