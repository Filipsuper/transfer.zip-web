import { useContext } from "react";
import { Modal } from "react-bootstrap";
import { ApplicationContext } from "../../providers/ApplicationProvider";

import "./UnlockFeatureModal.css"
import { Link } from "react-router-dom";
import QuestionMark from "../QuestionMark";
import { AuthContext } from "../../providers/AuthProvider";

export default function UnlockFeatureModal({ show }) {
    const { setShowUnlockFeatureModal } = useContext(ApplicationContext)
    const { user, isGuestUser, isFreeUser } = useContext(AuthContext)

    const ListItem = ({ icon, title, subtitle, plan, ...props }) => {
        return (
            <li className={"btn text-start bg-dark-subtle d-flex flex-row justify-content-between border rounded-2 p-4 py-3"} {...props}>
                <div className="d-flex flex-column">
                    <div>
                        <i className={"fs-6 me-2 bi " + icon}></i>
                        <span className="fs-6 fw-bold">{title}</span>
                    </div>
                    {subtitle && (
                        <div>
                            <span className=""><small>{subtitle}</small></span>
                        </div>
                    )}
                </div>
                <div className="horizontal center-h center-v ">
                    <small className="ms-2 bg-body-secondary rounded-1 fw-bold px-2">{plan}</small>
                </div>
            </li>
        )
    }

    const removeAdsForeverTooltip = (
        <span>If you purchase a plan, your account will <b>never-ever</b> see ads again, even if you cancel your subscription.</span>
    )

    return (
        <>
            <Modal animation={show} className="UnlockFeatureModal" show={show} centered onHide={() => setShowUnlockFeatureModal(false)}>
                {/* <Modal.Header closeButton>
                    <Modal.Title>Login to unlock more features.</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div className="py-3 pb-2">
                        <h2 className="text-center mb-4">Hold up!</h2>
                        <p className="mx-auto text-center fs-5" style={{ maxWidth: "450px" }}>
                            {isGuestUser() ? "Please sign in to use more features." : "New features are on the way, join the waitlist!"}
                        </p>
                        <div className="mb-4 m-auto" style={{ maxWidth: "450px" }}>
                            <ul className="text-body-secondary list-unstyled ms-2 me-1 d-flex flex-column gap-2">
                                {isGuestUser() && <ListItem icon={"bi-server"} title={"Transfers"} subtitle={"Store files permanently and share them."} plan={"FREE"} />}
                                {isGuestUser() ? (
                                    <ListItem icon={"bi-graph-up"} title={"Statistics"} plan={"COMING SOON"} />
                                ) : (
                                    <ListItem icon={"bi-graph-up"} title={"Statistics"} subtitle={"See downloads and views over time"} plan={"COMING SOON"} />
                                )}
                                <ListItem icon={"bi-lock-fill"} title={"Password protection"} plan={"COMING SOON"} />
                                <ListItem icon={"bi-envelope-fill"} title={"Send by email"} plan={"COMING SOON"} />
                                <ListItem icon={"bi-database-fill-add"} title={"1TB permanent storage"} plan={"COMING SOON"} />
                                {isFreeUser() && <ListItem icon={"bi-database-fill-add"} title={<>Remove ads forever<QuestionMark placement={"top"}>{removeAdsForeverTooltip}</QuestionMark></>} plan={"COMING SOON"} />}
                                {/* <ListItem><div><b>Create an account to:</b></div></ListItem> */}
                                {/* <ListItem><div><i className="bi bi-reception-4 me-2 text-primary-emphasis"></i><b>Relay</b> - Use Quick Share even when peer-to-peer is blocked</div>{freeIcon}</ListItem> */}
                                {/* <ListItem><div><i className="bi bi-server me-2 text-primary-emphasis"></i><b>Transfers</b> - Store files permanently and share them</div>{freeIcon}</ListItem> */}
                                {/* <ListItem><div><i className="bi bi-graph-up me-2 text-body"></i><b>Statistics</b> - Count downloads over time</div>{proIcon}</ListItem>
                                <ListItem><div><i className="bi bi-lock-fill me-2 text-body"></i>Password-protect transfers</div>{proIcon}</ListItem>
                                <ListItem><div><i className="bi bi-envelope-fill me-2 text-body"></i>Transfer files by email</div>{proIcon}</ListItem>
                                <ListItem><div className="text-success-emphasis"><i className="bi bi-shield-fill-check me-2 text-success-emphasis"></i>Remove ads forever<QuestionMark placement={"top"}>{removeAdsForeverTooltip}</QuestionMark></div>{proIcon}</ListItem> */}
                                {/* <ListItem><div><i className="bi bi-heart-fill me-2 text-danger"></i>Support the developers</div>{suppIcon}</ListItem> */}
                                {/* <li><Link to={"/about"}>Much more...</Link></li> */}
                            </ul>
                        </div>
                        {isGuestUser() ?
                            (
                                <div className="d-flex flex-row gap-2 justify-content-center">
                                    <Link onClick={() => setShowUnlockFeatureModal(false)} to={"/signup"} reloadDocument className="btn btn-primary rounded-pill px-5">Sign up</Link>
                                    <Link onClick={() => setShowUnlockFeatureModal(false)} to={"/login"} reloadDocument className="btn btn-outline-primary rounded-pill px-5">Login</Link>
                                </div>
                            )
                            :
                            (
                                <div className="d-flex flex-row gap-2 justify-content-center">
                                <Link onClick={() => setShowUnlockFeatureModal(false)} to={"/join-waitlist"} reloadDocument className="btn btn-primary rounded-pill px-5">Join Waitlist</Link>
                                    {/* <Link onClick={() => setShowUnlockFeatureModal(false)} to={"/upgrade"} reloadDocument className="btn btn-primary rounded-pill px-5">Upgrade</Link> */}
                                    {/* <Link onClick={() => setShowUnlockFeatureModal(false)} to={"/login"} className="btn btn-outline-primary rounded-pill px-5">Login</Link> */}
                                </div>
                            )
                        }
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <button onClick={onCancel} className="btn btn-primary">Ok</button>
                </Modal.Footer> */}
            </Modal>
        </>

    )
}