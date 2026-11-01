export interface BaseEntityModel {
    tenantId: number;
    id: string;
    creationTime: string;
    
}

export interface Customer extends BaseEntityModel {

    tenantId: number;
    fullName: string;
    companyName: string;
    email: string;
    phoneNumber: string;
     
}

export interface Workflow extends BaseEntityModel {

    name: string;
    description: string;
    isDefault: string;
    estimateTypeId: string;
    estimateTypeName: string;
    stages: WorkflowStage[];
    transitions: WorkflowTransition[];
}

export interface WorkflowStage {

    id: string;
    workflowId: string;
    title: string;
    description: string;
    ordering: string;
    isDefault: string;
    targetUsers: [];
    status: string;
}

export interface WorkflowTransition {

    id: string;
    workflowId: string;
    title: string;
    description: string;
    status: string;
    currentStageId: string;
    targetStageId: string;
    targetUsers: [];
}


export interface FinishingPrice extends BaseEntityModel { 

    collate: number; 
    perfectBind: number; 
    saddleStitch: number; 
    caseBind: number; 
    foldingTiers: any[];
    lamination: any;
    spot: any;

}

export interface ProductionOrder extends BaseEntityModel {

  quotationId: string;  
  quotationNumber: string;
  orderNumber: string;
  approvalDate: string | null;
  comments: string;
  status: number;
  title: string;
  tag: string;
  productId: string;
  productName: string;
  plannedQuantity: number;
  actualQuantity: number;
  plannedStartDate: string;
  actualStartDate: string | null;
  plannedEndDate: string;
  actualEndDate: string | null;
  estimatedBudget: number;
  productionRequestId: string;
  productionRequestNumber: string;
  priorityLevel: number;
  operationalStages: OperationalStage[];
}

export interface OperationalStage {

  id: string;
  sequenceNumber: number;
  name: string;
  description: string;
  workCenterId: string;
  workCenterName: string;
  estimatedDurationInHours: number;
  isMandatory: boolean;
  isApproved: boolean;
  onHold: boolean;
  isCompleted: boolean;
  requiresCustomerFeedBack: boolean;

  // Manager properties (from employees)
  managerId: string;
  managerName: string;
  managerEmail: string;
  managerDepartment: string;
  managerPhone: string;

  startDate: string;
  endDate: string;

  adminRemarks: string;
  customerRemarks: string;

  // Assets
  fileAssets: string[];
}




export interface QcChecklist extends BaseEntityModel {

    name: string;
    description: string;
    productId: string;
    productName: string;
    items: ProcessStep[];
}

export interface QcChecklistItem {

    id: string;
    sequenceNumber: string;
    parameter: string;
    method: string;
    acceptanceCriteria: string;
}


export interface Invoice extends BaseEntityModel {

    tenantId: number;
    invoiceNumber: string;
    fullName: string;
    companyName: string;
    email: string;
    phoneNumber: string;
    adRequestId: string;
    status: string;
    paidAt: string;
    dueDate: string;
    invoiceDate: string;
    description: string;
    subTotal: string;
    discountAmount: string;
    totalAmount: string;
    details: InvoiceDetail[];
    taxes: Taxes[];
    
}

export interface Quotation extends BaseEntityModel {

    tenantId: number;
    estimationIds: string[];
    quotationNumber: string;
    quotedPrice: string;
    discount: string;
    quotationDate: string;
    validUntil: string;
    approvalDate: string;
    customerFeedback: string;
    remainingDays: number;
    validityInDays: number;
    productionRequestId: string;
    productionRequestNumber: string;
    businessName: string;
    email: string;
    phoneNumber: string;
    workflowId: string;
    currentStageId: string;
    currentStageName: string;
    processingTimeLine: ProductionProcessingTimeLine[]
    details: InvoiceDetail[];
    taxes: Taxes[];
    specification?: string;
    origination?: string;
    terms?: string;
    description?: string;
    signatories?: any[];
    
}

export interface InvoiceDetail {

    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
}

export interface Taxes {

    id: number;
    taxName: string;
    rate: number;
    isPercentage: boolean;
    taxAmount: number;
}

export interface InvoiceStats {

    paidInvoices: number;
    totalInvoices: number;
    pendingInvoices: number;
    totalAmount: number;
}

export interface QuotationStats {

    totalQuotations: number;
    approvedQuotations: number;
    rejectedQuotations: number;
    draftQuotations: number;
    partiallyPaidQuotations: number;
    totalQuotationAmount: number;
}





export interface Product extends BaseEntityModel {

    name: string;
    category: string;
    unitOfMeasure: string;
    standardCost: number;
    sellingPrice: number;
}

export interface Staff {
    
  employeeIdentifier: string;  
  firstName: string;            
  otherName: string;            
  lastName: string;            
  employeePhoto: string;        
  title: string;                
  gender: string;              
  status: number;               
  residenceAddress: string;     
  departmentId: string;          
  departmentName: string;      
  dateAppointed: string;         
  maritalStatus: string;        
  phoneNumber: string;         
  email: string;
}


export interface WorkCenter extends BaseEntityModel {

    name: string;
    capacityPerHour: number;
    supervisorId: string;
    supervisorName: number;
    supervisorPhoneNo: number;
    supervisorEmail: number;
    departmentId: string;
    departmentName: string;
    operatingHours: OperatingHour[];
}

export interface OperatingHour {
    weekDay: string;
    openingTime: string;
    closingTime: string;
}


export interface ProductCategory extends BaseEntityModel {
    name: string;
    parentCategoryId: string;
}

export interface Uom extends BaseEntityModel {
    name: string;
    description: string;
}


export interface Department extends BaseEntityModel {
    name: string;
    description: string;
}

export interface FinishingOption extends BaseEntityModel {
    name: string;
}


export interface RawMaterial extends BaseEntityModel {

    name: string;
    sku: string;
    description: string;
    unitOfMeasure: string;
    unitOfMeasureId: string;
    currentStock: number;
    costingMethod: number;
    standardCost: number;
    sellingPrice: number;
    isActive: boolean;
    variants: RawMaterialVariant[]
}

export interface RawMaterialVariant {

    name: string;
    options: string [];
     
}

export interface FinishedGood extends BaseEntityModel {

    sku: string;
    name: string;
    description: string;
    unitOfMeasure: string;
    unitOfMeasureId: string;
    currentStock: string;
    costingMethod: string;
    standardCost: string;
    sellingPrice: string;
    isActive: boolean;
}

export interface Payment extends BaseEntityModel {

    transactionReference: string;
    receiptNo: string;
    invoiceId: string;
    invoiceNumber: string;
    amountPaid: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    paymentState: string;
    businessName: string;
    paymentSource: string; //estimate/quotation/invoice
    uploadedFiles: string[];
}

export interface ProductionRequestPaymentSummary extends BaseEntityModel {

    invoiceAmount: string;
    totalPaid: string;
    balanceDue: string;
    payments: Payment[];
}




export interface PaymentStats {

    totalTransactions: number;
    transactionsThisMonth: number;
    totalAmount: number;
    averageAmount: number;
}

 
export interface User {

    tenantId: number;
    id: number;
    name: string;
    surname: string;
    emailAddress: string;
    roleNames: string[];
    userName: string;
    isActive: boolean;
    fullName: string;
    phoneNumber: string;
}

export interface Role {

    tenantId: number;
    id: number;
    name: string;
    displayName: string;
    description: string;
    normalizedName: string;
    grantedPermissions: string[];
     
}

export interface RolePermision { 

    name: string;
    displayName: string;
    description: string;
}

export interface ApiCredentials { 

    accountId: string;
    accountSecret: string;

}

export interface UserAccount {
    user: UserInfo;
    tenant: Tenant;
}

export interface Tenant {
    tenancyName: string;
    name: string;
    id: number;
}

export interface UserInfo {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    phoneNumber: string;
    id: number;
}

 export interface ResetPasswordResponse {
      message: string;
      code: number;
 }
  
export interface FormulaInventoryItem {
  id: string;
  name: string;
  quantity: number;
  sku?: string;
  unitOfMeasure?: string;
}

export interface FormulaVariable extends BaseEntityModel {
  name: string;
  systemName: string;
  dataType: string;
  defaultValue: string;
}

export interface Formula extends BaseEntityModel {
  name: string; 
  expression: string; 
  userFriendlyExpression: string;
  estimateTypeId?: string;
  estimateTypeHexColour?: string;
  inventoryItems?: FormulaInventoryItem[];
}

export interface EstimateType extends BaseEntityModel {
  name: string; 
  hexColour: string; 
}

 

export interface Estimation {
  estimateNumber: string;
  productionRequestId: string;
  productionRequestNumber: string;
  estimateTypeId: string;
  estimateTypeName: string;
  businessName: string;
  jobName: string;
  quantity: number;
  size: string;
  date: Date;
  marginPercentage: number;
  isTemplate: boolean;
  estimatedCost: number;
  discount: number;
  description: string;
  estimatedTimeEffort: number;
  status: number;  
  preparedBy: string;
  approvalDate: Date;
  fullName: string;
  email: string;
  phoneNumber: string;
 statusChangeReason: string;
  workflowId: string;
  currentStageId: string;
  currentStageName: string;
  shortLink: string;
  summary: EstimationSummary;
  details: EstimateItem[];
  variables: EstimationVariable[];
  taxes: EstimateOrInvoiceTax[];
  processingTimeLine: ProductionProcessingTimeLine[];
}

export interface EstimationSummary {
 subTotal: number;
 unitCostOfProduction: number;
 marginAmount: number;
 totalExclVat: number;
 nhisGetFundAmount: number;
 vatAmount: number;
 grandTotal: number;
 taxRates: EstimationTaxRates;
}

export interface EstimationTaxRates {
   nhisGetFund: number;
   vat: number;
}

export interface EstimateItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  isFormula: boolean;
  isSteppingStone: boolean;
  formulaOutput: number;
  formulaId: string;
  expression: string;
  isPercentagePlugin: boolean,
  percentageTarget: string;
  percentageRate:number

}

export interface EstimationVariable {
    
  name: string;
  systemName: string;
  value: string;
}

export interface EstimateOrInvoiceTax {
  taxName: string;
  rate: number;
  isPercentage: boolean;
  taxAmount: number
}

export interface ProductionProcessingTimeLine {
    
   timeStamp: string;
   updatedBy: string;
   title: string;
   status: string;
   details: string;
}



export interface EstimateStats {

    partiallyPaidEstimates: number;
    totalEstimates: number;
    approvedEstimates: number;
    rejectedEstimates: number;
    draftEstimates: number;
    totalEstimateAmount: number;
}

export interface ProductionOrderStats {

    totalOrders: number;
    inProgress: number;
    draft: number;
    approved: number;
    rejected: number;
    scheduled: number;
    completed: number;
}


 
export interface ProductionRequest extends BaseEntityModel {

    createdAt: string;
    requestNumber: string;
    customerName: string;
    serviceCategoryName: string;
    noOfJobs: string;
    jobName: string;
    size: string;
    phoneNo: string;
    finishing: string[]; // as finishing options ids; 
    invoiceAmount: string;
    customerPhoneNumber: string;
    customerEmail: string;
    email: string;
    businessName: string;
    quantity: number;
    workflowId: string;
    currentStageId: string;
    currentStageName: string;
    adminRemarks: string;
    paperInside: string;
    paperInsideVariant: string;
    paperInsideRawMaterialId: string;
    paperCover: string;
    paperCoverVariant: string;
    paperCoverRawMaterialId: string;
    processingTimeLine: ProductionProcessingTimeLine[]

}

export interface ProductionProcessingTimeLine {
    id: string; 
    timeStamp: string;
    updatedBy: string;
    title: string;
    status: string; // Success, Failed, Pending
    details: string;
}


export interface ProductionRequestStats {
    totalRequests: number;
    pending: number;
    approved: number;
    rejected: number;
    scheduled: number;
    published: number;  
}


export interface TaxRate extends BaseEntityModel {

    name: string;
    rate: string;
    isPercentage: boolean;
    isActive: boolean;
    
}


export interface Signatory extends BaseEntityModel {

    name: string;
    designation: string;
    phoneNo: string;
    signatureImageUrl: string;
    
}




export interface ActivityLog {

    title: string;
    details: string;
    associatedService: string;
    indicatorColor: string;
    
}

export interface DashboardSummaryStats {
    totalCustomers: number;
    customersPercentChange: number;
    totalAdRequests: number;
    adRequestsPercentChange: number;
    totalInvoices: number;
    invoicesPercentChange: number;
    totalPayments: number;
    paymentsPercentChange: number;
}




