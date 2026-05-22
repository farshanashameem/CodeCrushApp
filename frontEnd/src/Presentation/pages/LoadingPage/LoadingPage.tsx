import "./LoadingPage.css"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Confetti from "react-confetti"
import LoadingBG from "../../../assets/LoadingBG.png"
import Logo from "../../../assets/logo.png"

const LoadingPage = () => {

  const navigate = useNavigate()

  useEffect(() => {

    const timer = setTimeout(() => {

      const token = localStorage.getItem("token")

      if (token) {
        navigate("/parent/dashboard")
      } else {
        navigate("/home")
      }

    }, 2500)

    return () => clearTimeout(timer)

  }, [navigate])

  return (
    <div className="loading-container">

      {/* Background */}
      <img
        src={LoadingBG}
        alt="background"
        className="bg-image"
      />

      {/* Confetti */}
      <Confetti numberOfPieces={100} recycle />

      {/* Stars */}
      <div className="stars"></div>

      {/* Logo */}
      <img
        src={Logo}
        alt="logo"
        className="logo"
      />

      <div className="content">

        <h1 className="loading-text">
          Loading...
        </h1>

        <div className="dots">
          <span className="dot"></span>
          <span className="dot delay1"></span>
          <span className="dot delay2"></span>
        </div>

        <div className="progress-container">
          <div className="loadingBar"></div>
        </div>

      </div>

    </div>
  )
}

export default LoadingPage