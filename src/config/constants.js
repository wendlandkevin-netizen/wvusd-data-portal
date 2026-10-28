// src/config/constants.js

// 1. Paste your deployed Google Apps Script Web App URL here:
export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwcjQe2hhjKYwYp8cOiXD8YvfeXrtwo-d2uuGmzneeiPjOO4thoh_xbpYbDDCkglqc/exec";

// 2. Paste your Google Cloud OAuth Web Client ID here (for 1-Click Sign-In on GitHub Pages):
export const GOOGLE_CLIENT_ID = "243489966839-kcopbaj692oat1p2hoq5lrcddq9n4k17.apps.googleusercontent.com";

export const SUPER_ADMIN_EMAIL = "kwendland@wvusd.org";
export const ALLOWED_DOMAINS = ["wvusd.org", "sub.wvusd.org"];

/**
 * Year-over-Year (YoY) Performance Classification Thresholds
 * 
 * Defines the neutral tolerance band around 0% (noise threshold)
 * and the 5-Tier Executive Classification Scale:
 * 
 * 1. Strong Growth
 * 2. Moderate Growth
 * 3. Maintained / Stable (Neutral tolerance band around 0)
 * 4. Moderate Decline
 * 5. Significant Decline
 * 
 * Dual Metric Context:
 * - Standard / Relative (%) : Applied to Grade Equivalents (STAR Reading IRL, Amira Fluency ARM)
 * - Low Volatility / Scores (pp) : Applied to percentage/score metrics (Math Common Assessments 0-100%, Rubrics, Phonics %)
 */
export const YOY_THRESHOLDS = {
    // Neutral Tolerance Band around 0: fluctuations within this band are statistical noise / maintained parity
    TOLERANCE_BAND_PCT: 2.0, // ±2% for relative metrics
    TOLERANCE_BAND_PP: 2.0,  // ±2.0 pp for percentage metrics

    // Relative Metrics (%) - STAR Reading IRL, Amira Fluency ARM
    STANDARD_RELATIVE: {
        STRONG_GROWTH: 10.0,        // > +10%
        MODERATE_GROWTH_MIN: 2.0,   // +2% to +10%
        MAINTAINED_MIN: -2.0,       // -2% to +2% (Neutral Tolerance Band)
        MAINTAINED_MAX: 2.0,
        MODERATE_DECLINE_MAX: -2.0, // -2% to -10%
        SIGNIFICANT_DECLINE: -10.0  // < -10%
    },

    // Low Volatility / Percentage Score Metrics (pp) - Math Common Assessment (0-100%), Rubrics, Phonics %
    PERCENTAGE_SCORES: {
        STRONG_GROWTH: 5.0,         // > +5.0 pp
        MODERATE_GROWTH_MIN: 2.0,   // +2.0 pp to +5.0 pp
        MAINTAINED_MIN: -2.0,       // -2.0 pp to +2.0 pp (Neutral Tolerance Band)
        MAINTAINED_MAX: 2.0,
        MODERATE_DECLINE_MAX: -2.0, // -2.0 pp to -5.0 pp
        SIGNIFICANT_DECLINE: -5.0   // < -5.0 pp
    }
};

/**
 * Authoritative English Learner (EL) & Language Classification Standards (Roster!j:j)
 * 
 * California / WVUSD Guidelines:
 * - LEP (Limited English Proficiency / Active EL): Exclusively counted in official "EL Count".
 * - RFEP (Redesignated Fluent English Proficient): Excluded from EL count, but monitored and tagged for teachers.
 * - IFEP (Initially Fluent English Proficient): Excluded from EL count, tagged for teacher awareness.
 * - EO (English Only): Native English speakers.
 */
export const LANGUAGE_CLASSIFICATIONS = {
    EL: {
        code: 'EL',
        label: 'English Learner (LEP)',
        badgeLabel: 'EL (LEP)',
        countedInEL: true,
        color: 'amber'
    },
    RFEP: {
        code: 'RFEP',
        label: 'Redesignated Fluent (RFEP)',
        badgeLabel: 'Redesignated (RFEP)',
        countedInEL: false,
        color: 'teal'
    },
    IFEP: {
        code: 'IFEP',
        label: 'Initially Fluent (IFEP)',
        badgeLabel: 'Initially Fluent (IFEP)',
        countedInEL: false,
        color: 'sky'
    },
    EO: {
        code: 'EO',
        label: 'English Only',
        badgeLabel: 'EO',
        countedInEL: false,
        color: 'slate'
    }
};

export const DISTRICT_LOGO =
    "https://res.cloudinary.com/djv9u4054/image/upload/v1783959106/UPdated_Black_and_White_Logo-removebg-preview_zubeqp.png";

export const SITE_LOGOS = {
    "diamond bar": "https://res.cloudinary.com/djv9u4054/image/upload/v1783632852/0-DBARBRAHMASWide_q8uled-removebg-preview_x7ta88.png",
    "south pointe": "https://res.cloudinary.com/djv9u4054/image/upload/v1783623577/copy_of_copy_of_spt_logo-removebg-preview_l7eve6.png",
    "maple hill": "https://res.cloudinary.com/djv9u4054/image/upload/v1783459666/copy_of_untitled_design_6_qhbikx.png",
    "chaparral": "https://res.cloudinary.com/djv9u4054/image/upload/v1781797508/CHP_Logo-removebg-preview_npea0e.png",
    "suzanne": "https://res.cloudinary.com/djv9u4054/image/upload/v1780597225/Suzanne_iqsuyo.png",
    "walnut high": "https://res.cloudinary.com/djv9u4054/image/upload/v1780504988/stickerwhs_iwwwxs_rx0om9.png",
    "hockwalt": "https://res.cloudinary.com/djv9u4054/image/upload/v1777564560/Untitled_design_4_tjyhnp.png",
    "collegewood": "https://res.cloudinary.com/djv9u4054/image/upload/v1777485387/Untitled_design_14_on26t9.png",
    "vejar": "https://res.cloudinary.com/djv9u4054/image/upload/v1777485064/Untitled_design_13_ohnd95.png",
    "castle rock": "https://res.cloudinary.com/djv9u4054/image/upload/v1777486030/Untitled_design_15_dt6zmq.png",
    "evergreen": "https://res.cloudinary.com/djv9u4054/image/upload/v1777484631/Untitled_design_12_le66tp.png",
    "quail summit": "https://res.cloudinary.com/djv9u4054/image/upload/v1777484271/Untitled_design_11_bd8mmm.png",
    "walnut elementary": "https://res.cloudinary.com/djv9u4054/image/upload/v1777483405/Untitled_design_10_imwook.png",
    "westhoff": "https://res.cloudinary.com/djv9u4054/image/upload/v1777482954/Untitled_design_9_pkf2df.png",
    "morris": "https://res.cloudinary.com/djv9u4054/image/upload/v1777482304/Untitled_design_7_kyzokr.png"
};

/**
 * Resolves any school site string (e.g., "Cyrus J. Morris Elementary School" or "Leonard G. Westhoff Elementary")
 * to its matching Cloudinary logo, or falls back to the WVUSD District Logo.
 */
export function getSiteLogo(siteName) {
    if (!siteName || siteName === "ALL") return DISTRICT_LOGO;
    const lower = String(siteName).toLowerCase();
    if (lower.includes("walnut") && !lower.includes("high")) {
        return SITE_LOGOS["walnut elementary"];
    }
    for (const [key, url] of Object.entries(SITE_LOGOS)) {
        if (lower.includes(key)) return url;
    }
    return DISTRICT_LOGO;
}

/**
 * Enforces strict @wvusd.org and @sub.wvusd.org check on the client side
 */
export function isValidStaffEmail(email) {
    if (!email) return false;
    const clean = String(email).toLowerCase().trim();
    const parts = clean.split("@");
    if (parts.length !== 2) return false;
    if (parts[1] === "stu.wvusd.org") return false;
    return ALLOWED_DOMAINS.includes(parts[1]);
}