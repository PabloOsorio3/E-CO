export interface CustomerDetail {
    id: string;
    name: string;
    phone: string;
    email: string;
    orderCount: number;
    totalSpend: string;
    status: 'Active' | 'Inactive' | 'VIP';
    address: string;
    registrationDate: string;
    lastPurchaseDate: string;
    totalOrders: number;
    completedOrders: number;
    canceledOrders: number;
    avatar: string;
}

// Generate static list for initial display or searching
export const getMockCustomersList = (count: number): CustomerDetail[] => {
    const list: CustomerDetail[] = [];
    const names = [
        'John Doe', 'Jane Smith', 'Emily Davis', 'Mark Taylor', 'Sophia Wilson',
        'Robert Miller', 'Jessica Taylor', 'David Anderson', 'Emma Thomas', 'James Martin',
        'Oliver Brown', 'Isabella Garcia', 'William Martinez', 'Mia Robinson', 'Lucas Clark',
        'Charlotte Rodriguez', 'Henry Lewis', 'Amelia Lee', 'Alexander Walker', 'Evelyn Hall'
    ];
    const statuses: ('Active' | 'Inactive' | 'VIP')[] = ['Active', 'Inactive', 'VIP'];

    for (let i = 0; i < count; i++) {
        const name = names[i % names.length];
        const status = statuses[i % 3];
        const spend = 150 + (i * 125) + (i % 3 === 0 ? 40 : 0);
        const orders = 3 + (i % 4) * 8 + (i % 3);
        const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;

        list.push({
            id: `#CUST${String(i + 1).padStart(3, '0')}`,
            name: name,
            phone: `+12345${100000 + i}`,
            email: email,
            orderCount: orders,
            totalSpend: spend.toFixed(2),
            status: status,
            address: `${100 + i} Main St, NY`,
            registrationDate: `${10 + (i % 15)}.0${1 + (i % 8)}.2025`,
            lastPurchaseDate: `${12 + (i % 12)}.0${1 + (i % 8)}.2025`,
            totalOrders: orders * 4,
            completedOrders: Math.floor(orders * 3.6),
            canceledOrders: Math.floor(orders * 0.4),
            avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&q=80&w=150`
        });
    }
    return list;
};
