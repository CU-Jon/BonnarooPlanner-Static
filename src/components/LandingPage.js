// src/components/LandingPage.js
import React from 'react';
import Footer from './Footer';

export default function LandingPage() {
    return (
        <div className="page-wrap">
            <header className="site-header">
                <h1>Bonnaroo <span>Festival Tools</span></h1>
                <p>Plan your schedule &bull; Pack your bags</p>
            </header>

            <main>
                <div className="landing-hub">
                    <p className="landing-tagline">What do you want to do?</p>
                    <div className="feature-cards">
                        <a href="/planner/" className="feature-card">
                            <div className="feature-card-icon" aria-hidden="true">📅</div>
                            <div className="feature-card-title">Schedule Planner</div>
                            <p className="feature-card-desc">
                                Browse the Bonnaroo lineup, pick your must-see acts, and build
                                a personalized schedule you can export to PDF, CSV, or calendar.
                            </p>
                            <span className="feature-card-cta">Build your schedule →</span>
                        </a>

                        <a href="/packing-list/" className="feature-card">
                            <div className="feature-card-icon" aria-hidden="true">🎒</div>
                            <div className="feature-card-title">Packing List</div>
                            <p className="feature-card-desc">
                                Check off everything you need to bring, add your own items and
                                categories, then generate a printable list or save it as a PDF.
                            </p>
                            <span className="feature-card-cta">Start packing →</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
