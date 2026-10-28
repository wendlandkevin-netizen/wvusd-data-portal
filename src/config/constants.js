// src/config/constants.js

// 1. Paste your deployed Google Apps Script Web App URL here:
export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxEkGg1GzA435GHWwMHSSSAp1-5BqNYLyiXIyR91bVudqP4DKVLIGuVi7GAABME1x5t/exec";

// 2. Paste your Google Cloud OAuth Web Client ID here (for 1-Click Sign-In on GitHub Pages):
export const GOOGLE_CLIENT_ID = "243489966839-kcopbaj692oat1p2hoq5lrcddq9n4k17.apps.googleusercontent.com";

export const SUPER_ADMIN_EMAIL = "kwendland@wvusd.org";
export const ALLOWED_DOMAINS = ["wvusd.org", "sub.wvusd.org"];

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