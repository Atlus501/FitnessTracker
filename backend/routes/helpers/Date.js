const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    // Add 1 to month, and pad with a leading '0' if it's a single digit
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

module.exports = getDate;