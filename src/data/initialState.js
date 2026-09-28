// Initial mock data for Apex Bank Educational Platform

export const INITIAL_CUSTOMERS = [
  {
    id: "usr_sarah",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    tier: "Gold Premier",
    memberSince: "2022-04-12",
    phone: "+1 (555) 234-8901",
    address: "742 Evergreen Terrace, Springfield, IL",
    status: "Active",
    kycVerified: true,
    dailyLimit: 25000,
    dailySpent: 1250,
    accounts: [
      {
        id: "acc_chk_01",
        accountNumber: "904128371",
        routingNumber: "021000021",
        name: "Everyday Checking",
        type: "Checking",
        balance: 14250.80,
        currency: "USD",
        status: "Active",
        createdAt: "2022-04-12"
      },
      {
        id: "acc_sav_01",
        accountNumber: "904128372",
        routingNumber: "021000021",
        name: "High-Yield Savings",
        type: "Savings",
        balance: 48600.00,
        currency: "USD",
        apy: 4.5,
        status: "Active",
        createdAt: "2022-05-01"
      },
      {
        id: "acc_inv_01",
        accountNumber: "904128373",
        routingNumber: "021000021",
        name: "Investment Vault",
        type: "Investment",
        balance: 9800.00,
        currency: "USD",
        status: "Active",
        createdAt: "2023-01-15"
      }
    ],
    cards: [
      {
        id: "crd_01",
        cardNumber: "4532882190414829",
        cardHolder: "SARAH JENKINS",
        expiry: "08/28",
        cvv: "392",
        type: "Visa Debit",
        color: "gradient-blue",
        isFrozen: false,
        dailyLimit: 5000,
        contactless: true,
        international: true,
        linkedAccountId: "acc_chk_01"
      },
      {
        id: "crd_02",
        cardNumber: "5412759902349102",
        cardHolder: "SARAH JENKINS",
        expiry: "12/29",
        cvv: "814",
        type: "Apex Platinum Credit",
        color: "gradient-gold",
        isFrozen: false,
        dailyLimit: 15000,
        contactless: true,
        international: true,
        linkedAccountId: "acc_chk_01"
      }
    ]
  },
  {
    id: "usr_david",
    name: "David Miller",
    email: "david.m@millertech.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    tier: "Business Elite",
    memberSince: "2021-09-08",
    phone: "+1 (555) 892-1144",
    address: "100 Innovation Way, Suite 400, Austin, TX",
    status: "Active",
    kycVerified: true,
    dailyLimit: 50000,
    dailySpent: 8400,
    accounts: [
      {
        id: "acc_chk_02",
        accountNumber: "883019284",
        routingNumber: "021000021",
        name: "Business Operating",
        type: "Checking",
        balance: 92400.15,
        currency: "USD",
        status: "Active",
        createdAt: "2021-09-08"
      },
      {
        id: "acc_sav_02",
        accountNumber: "883019285",
        routingNumber: "021000021",
        name: "Reserve Capital",
        type: "Savings",
        balance: 152000.00,
        currency: "USD",
        apy: 4.5,
        status: "Active",
        createdAt: "2022-02-10"
      }
    ],
    cards: [
      {
        id: "crd_03",
        cardNumber: "5210984411026731",
        cardHolder: "DAVID MILLER",
        expiry: "11/27",
        cvv: "105",
        type: "Mastercard Corporate",
        color: "gradient-dark",
        isFrozen: false,
        dailyLimit: 20000,
        contactless: true,
        international: true,
        linkedAccountId: "acc_chk_02"
      }
    ]
  },
  {
    id: "usr_elena",
    name: "Elena Rostova",
    email: "elena.rostova@globalcapital.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    tier: "Private Client",
    memberSince: "2020-03-19",
    phone: "+1 (555) 773-4400",
    address: "55 Wall Street, Apt 18B, New York, NY",
    status: "Active",
    kycVerified: true,
    dailyLimit: 100000,
    dailySpent: 0,
    accounts: [
      {
        id: "acc_chk_03",
        accountNumber: "771928301",
        routingNumber: "021000021",
        name: "Private Premier Checking",
        type: "Checking",
        balance: 215800.50,
        currency: "USD",
        status: "Active",
        createdAt: "2020-03-19"
      },
      {
        id: "acc_sav_03",
        accountNumber: "771928302",
        routingNumber: "021000021",
        name: "Global Wealth Treasury",
        type: "Savings",
        balance: 340000.00,
        currency: "USD",
        apy: 4.75,
        status: "Active",
        createdAt: "2020-05-10"
      }
    ],
    cards: [
      {
        id: "crd_04",
        cardNumber: "3782822490104921",
        cardHolder: "ELENA ROSTOVA",
        expiry: "04/30",
        cvv: "902",
        type: "Amex Black Metal",
        color: "gradient-emerald",
        isFrozen: false,
        dailyLimit: 50000,
        contactless: true,
        international: true,
        linkedAccountId: "acc_chk_03"
      }
    ]
  },
  {
    id: "usr_marcus",
    name: "Marcus Vance",
    email: "marcus.vance@techcorp.org",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    tier: "Standard",
    memberSince: "2023-11-04",
    phone: "+1 (555) 412-9900",
    address: "412 Oak Avenue, Chicago, IL",
    status: "Frozen",
    kycVerified: true,
    dailyLimit: 2000,
    dailySpent: 0,
    accounts: [
      {
        id: "acc_chk_04",
        accountNumber: "551029381",
        routingNumber: "021000021",
        name: "Standard Checking",
        type: "Checking",
        balance: 1450.25,
        currency: "USD",
        status: "Frozen",
        createdAt: "2023-11-04"
      }
    ],
    cards: [
      {
        id: "crd_05",
        cardNumber: "4111222233334444",
        cardHolder: "MARCUS VANCE",
        expiry: "01/27",
        cvv: "441",
        type: "Visa Classic",
        color: "gradient-slate",
        isFrozen: true,
        dailyLimit: 1000,
        contactless: false,
        international: false,
        linkedAccountId: "acc_chk_04"
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx_901",
    date: "2026-09-28T06:15:00Z",
    amount: 1250.00,
    type: "transfer_out",
    category: "Transfer",
    description: "External Wire to TechCorp LLC",
    senderId: "usr_sarah",
    senderAccountId: "acc_chk_01",
    recipientName: "TechCorp LLC",
    recipientAccount: "Wire #99021841",
    status: "Completed",
    referenceNumber: "REF-20260928-8821",
    fee: 15.00
  },
  {
    id: "tx_902",
    date: "2026-09-27T14:30:00Z",
    amount: 4500.00,
    type: "deposit",
    category: "Income",
    description: "Direct Deposit - Global Design Inc Payroll",
    senderId: "ext_payroll",
    senderAccountId: "Payroll Direct",
    recipientName: "Sarah Jenkins",
    recipientAccount: "904128371",
    status: "Completed",
    referenceNumber: "PAY-88301-449",
    fee: 0
  },
  {
    id: "tx_903",
    date: "2026-09-26T18:45:00Z",
    amount: 250.00,
    type: "p2p_out",
    category: "P2P",
    description: "Instant P2P Transfer to David Miller",
    senderId: "usr_sarah",
    senderAccountId: "acc_chk_01",
    recipientName: "David Miller",
    recipientAccount: "883019284",
    status: "Completed",
    referenceNumber: "P2P-99410-218",
    fee: 0
  },
  {
    id: "tx_904",
    date: "2026-09-25T11:20:00Z",
    amount: 182.40,
    type: "card_purchase",
    category: "Shopping",
    description: "Whole Foods Market - Organic Groceries",
    senderId: "usr_sarah",
    senderAccountId: "acc_chk_01",
    recipientName: "Whole Foods Market",
    recipientAccount: "POS Merchant #4401",
    status: "Completed",
    referenceNumber: "POS-1092-9481",
    fee: 0
  },
  {
    id: "tx_905",
    date: "2026-09-24T09:00:00Z",
    amount: 500.00,
    type: "internal_transfer",
    category: "Savings",
    description: "Automated Monthly Savings Deposit",
    senderId: "usr_sarah",
    senderAccountId: "acc_chk_01",
    recipientName: "High-Yield Savings",
    recipientAccount: "904128372",
    status: "Completed",
    referenceNumber: "INT-88301-112",
    fee: 0
  },
  {
    id: "tx_906",
    date: "2026-09-23T16:10:00Z",
    amount: 120.00,
    type: "bill_payment",
    category: "Utilities",
    description: "City Electric & Power Utility Bill",
    senderId: "usr_sarah",
    senderAccountId: "acc_chk_01",
    recipientName: "City Power & Light",
    recipientAccount: "Bill Pay #883910",
    status: "Completed",
    referenceNumber: "BILL-5501-992",
    fee: 0
  },
  {
    id: "tx_907",
    date: "2026-09-28T04:10:00Z",
    amount: 35000.00,
    type: "transfer_out",
    category: "Wire Transfer",
    description: "Commercial Equipment Wire - Apex Offshore",
    senderId: "usr_david",
    senderAccountId: "acc_chk_02",
    recipientName: "Apex Offshore Logistics",
    recipientAccount: "SWIFT: APEXUS33",
    status: "Under Review",
    referenceNumber: "WIRE-20260928-9901",
    fee: 25.00
  },
  {
    id: "tx_908",
    date: "2026-09-22T10:00:00Z",
    amount: 182.25,
    type: "interest",
    category: "Interest",
    description: "Monthly Interest Credit (4.5% APY)",
    senderId: "system",
    senderAccountId: "Apex System Pool",
    recipientName: "Sarah Jenkins",
    recipientAccount: "904128372",
    status: "Completed",
    referenceNumber: "INT-PAY-2026-09",
    fee: 0
  }
];

export const INITIAL_PENDING_APPROVALS = [
  {
    id: "app_wire_991",
    type: "High Value Wire",
    requestedBy: "David Miller",
    userId: "usr_david",
    accountNumber: "883019284",
    amount: 35000.00,
    recipient: "Apex Offshore Logistics (SWIFT: APEXUS33)",
    date: "2026-09-28T04:10:00Z",
    riskScore: "Medium (Exceeds $10,000 threshold)",
    transactionId: "tx_907",
    status: "Pending"
  },
  {
    id: "app_loan_402",
    type: "Loan Application",
    requestedBy: "Sarah Jenkins",
    userId: "usr_sarah",
    accountNumber: "904128371",
    amount: 15000.00,
    purpose: "Home Solar & Energy Renovation",
    termMonths: 24,
    proposedRate: "5.8% APR",
    monthlyPayment: 663.20,
    date: "2026-09-27T19:30:00Z",
    riskScore: "Low (Credit Score 785)",
    status: "Pending"
  },
  {
    id: "app_acc_109",
    type: "New Business Account",
    requestedBy: "Marcus Vance",
    userId: "usr_marcus",
    accountNumber: "Requested: Business Treasury",
    amount: 5000.00,
    purpose: "Corporate Expansion",
    date: "2026-09-26T15:20:00Z",
    riskScore: "High (User account currently Frozen)",
    status: "Pending"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log_1001",
    timestamp: "2026-09-28T07:10:00Z",
    actor: "Admin (Chief Risk Officer)",
    action: "SYSTEM_CHECK",
    details: "Automated compliance scan executed successfully. 1 flagged wire.",
    ipAddress: "192.168.1.105",
    severity: "info"
  },
  {
    id: "log_1002",
    timestamp: "2026-09-28T04:10:00Z",
    actor: "David Miller",
    action: "WIRE_INITIATED",
    details: "Outbound Wire of $35,000.00 sent to approval queue.",
    ipAddress: "172.56.21.90",
    severity: "warning"
  },
  {
    id: "log_1003",
    timestamp: "2026-09-27T12:00:00Z",
    actor: "Admin (Compliance)",
    action: "ACCOUNT_FROZEN",
    details: "Account ACC-551029381 (Marcus Vance) frozen due to verification request.",
    ipAddress: "192.168.1.102",
    severity: "danger"
  },
  {
    id: "log_1004",
    timestamp: "2026-09-26T08:30:00Z",
    actor: "Sarah Jenkins",
    action: "LIMIT_CHANGED",
    details: "Card 4532...4829 daily spending limit adjusted to $5,000.",
    ipAddress: "73.189.44.12",
    severity: "info"
  }
];

export const INITIAL_SYSTEM_CONFIG = {
  bankName: "Apex Global Financial",
  routingNumber: "021000021",
  savingsApy: 4.50,
  wireFee: 15.00,
  p2pFee: 0.00,
  maxDailyLimitDefault: 25000.00,
  highValueThreshold: 10000.00,
  simulatedNetworkDelay: true,
  require2FAForTransfers: true
};

export const SAVED_PAYEES = [
  { id: "p1", name: "David Miller", account: "883019284", bank: "Apex Bank Internal", type: "P2P" },
  { id: "p2", name: "Elena Rostova", account: "771928301", bank: "Apex Bank Internal", type: "P2P" },
  { id: "p3", name: "Apex Offshore Logistics", account: "SWIFT: APEXUS33", bank: "Barclays Intl", type: "Wire" },
  { id: "p4", name: "City Power & Light", account: "Bill Pay #883910", bank: "Utility Pay", type: "Bill" },
  { id: "p5", name: "Comcast Broadband", account: "Acct #992104-88", bank: "Utility Pay", type: "Bill" }
];
