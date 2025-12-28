function useDateFormat() {
    return (date: Date) => {
        const day = date.getDate();

        const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
        const suffixes = { zero: 'th', many: 'th', one: 'st', two: 'nd', few: 'rd', other: 'th' };
        const suffix = suffixes[pr.select(day)];

        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const year = date.getFullYear();

        return `${month} ${day}${suffix}, ${year}`;
    };
}

export default useDateFormat;