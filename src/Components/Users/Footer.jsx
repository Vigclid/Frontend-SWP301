import React, { useContext, useState } from "react";
import { Container, Grid, Typography, IconButton, Button } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";
import "../../css/Footer.css";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="footer" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <Container className="footer-container">
        <Grid container spacing={4}>
          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Contact Us</Typography>
              <div className="footer-content">
                <Typography className="contact-item">
                  <EmailIcon className="contact-icon" />
                  artixsupport@gmail.com
                </Typography>
                <Typography className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  +84 (035) 6759 177
                </Typography>
                <Typography className="contact-item">
                  <LocationOnIcon className="contact-icon" />
                  FPT University | Da Nang
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Follow Us</Typography>
              <div className="footer-content">
                <Typography style={{ marginBottom: "16px" }}>Connect with us on social media</Typography>
                <div className="social-links">
                  <IconButton
                    className="social-icon"
                    href="https://facebook.com"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    className="social-icon"
                    href="https://twitter.com"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    className="social-icon"
                    href="https://instagram.com"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <InstagramIcon />
                  </IconButton>
                  <IconButton
                    className="social-icon"
                    href="https://linkedin.com"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <LinkedInIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </Grid>

          {/* Newsletter Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Newsletter</Typography>
              <div className="footer-content">
                <Typography style={{ marginBottom: "16px" }}>Subscribe to our newsletter for updates</Typography>
                <form onSubmit={handleSubmit} className="newsletter-form">
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.3)`,
                      color: theme.color,
                    }}
                    required
                  />
                  <IconButton
                    type="submit"
                    className="newsletter-button"
                    style={{
                      color: theme.color,
                      backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.5)`,
                    }}>
                    <SendIcon />
                  </IconButton>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <Typography>© {new Date().getFullYear()} Artix. All rights reserved.</Typography>
        </div>
      </Container>
    </footer>
  );
}
