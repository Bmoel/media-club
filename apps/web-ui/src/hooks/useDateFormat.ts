function useDateFormat() {
    return (date: Date) => {
        const day = date.getUTCDate();

        const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
        const suffixes = { zero: 'th', many: 'th', one: 'st', two: 'nd', few: 'rd', other: 'th' };
        const suffix = suffixes[pr.select(day)] ?? 'th';

        const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();

        return `${month} ${day}${suffix}, ${year}`;
    };
}

export default useDateFormat;