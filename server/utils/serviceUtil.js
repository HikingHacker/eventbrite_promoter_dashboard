export function isHiddenPromoCode(code) {
    let hidden = ['FREE_TICKET_DEV_TEST', 'WAVE', 'BASSEXHIBIT', 'BEEBO'];
    const uppercasedCode = code.toUpperCase();
    return hidden.includes(uppercasedCode);
}