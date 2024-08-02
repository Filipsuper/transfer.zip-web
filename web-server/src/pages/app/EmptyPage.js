import { useContext, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { AuthContext } from "../../providers/AuthProvider"
import { Helmet } from "react-helmet"
import { isSelfHosted } from "../../utils"

/**
 * Empty Page, for redirecting users to the right page. The "default" route.
 */
export default function EmptyPage({ }) {
    const { user, isGuestOrFreeUser, isGuestUser } = useContext(AuthContext)

    const navigate = useNavigate()

    let willRedirectToQuickShare = false
    let hashList = null
    if (window.location.hash) {
        if(isSelfHosted()) {
            hashList = window.location.hash.slice(1).split(",")
            willRedirectToQuickShare = hashList.length === 3
        }
    }

    useEffect(() => {
        if(willRedirectToQuickShare) return
        const timeoutId = setTimeout(() => navigate("/app/quick-share"), 5000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    useEffect(() => {
        if(willRedirectToQuickShare) return
        if (user) {
            if (isGuestUser()) {
                navigate("/app/quick-share", { replace: true })
            }
            else {
                navigate("/app/dashboard", { replace: true })
            }
        }
    }, [user])

    if (willRedirectToQuickShare) {
        const [key_b, recipientId, directionChar] = hashList

        if (recipientId.length !== 36 && (directionChar !== "R" && directionChar !== "S")) {
            throw "The URL parameters are malformed. Did you copy the URL correctly?"
        }

        const state = {
            k: key_b,
            remoteSessionId: recipientId,
            transferDirection: directionChar
        }

        window.location.hash = ""
        let newLocation = directionChar == "R" ? "/app/quick-share/progress" : "/app/quick-share"
        return <Navigate to={newLocation} state={state} replace={true} />
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 overflow-hidden">
            <div className="">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}