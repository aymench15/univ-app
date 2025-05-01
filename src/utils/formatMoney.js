export function formatMoney(amount) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "DZA" }).format(
        amount,
    );
}