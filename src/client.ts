import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const BASE_URL = "https://services.leadconnectorhq.com";
const DEFAULT_VERSION = "2021-07-28";
const CONVERSATIONS_VERSION = "2021-04-15";

export class GhlClient {
  private http: AxiosInstance;
  private locationId: string;

  constructor(token: string, locationId: string) {
    this.locationId = locationId;
    this.http = axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Version: DEFAULT_VERSION,
      },
    });
  }

  private convHeaders(): AxiosRequestConfig {
    return { headers: { Version: CONVERSATIONS_VERSION } };
  }

  private calHeaders(): AxiosRequestConfig {
    return { headers: { Version: CONVERSATIONS_VERSION } };
  }

  // ── Contacts ──────────────────────────────────────────

  searchContacts = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/contacts/", { params: { locationId: this.locationId, ...params } })
      .then((r) => r.data);

  getContact = (id: string) =>
    this.http.get(`/contacts/${id}`).then((r) => r.data);

  createContact = (data: Record<string, unknown>) =>
    this.http
      .post("/contacts/", { locationId: this.locationId, ...data })
      .then((r) => r.data);

  updateContact = (id: string, data: Record<string, unknown>) =>
    this.http.put(`/contacts/${id}`, data).then((r) => r.data);

  deleteContact = (id: string) =>
    this.http.delete(`/contacts/${id}`).then((r) => r.data);

  upsertContact = (data: Record<string, unknown>) =>
    this.http
      .post("/contacts/upsert", { locationId: this.locationId, ...data })
      .then((r) => r.data);

  addContactTags = (id: string, tags: string[]) =>
    this.http.post(`/contacts/${id}/tags`, { tags }).then((r) => r.data);

  removeContactTags = (id: string, tags: string[]) =>
    this.http
      .delete(`/contacts/${id}/tags`, { data: { tags } })
      .then((r) => r.data);

  getContactNotes = (id: string) =>
    this.http.get(`/contacts/${id}/notes`).then((r) => r.data);

  createContactNote = (id: string, body: string) =>
    this.http.post(`/contacts/${id}/notes`, { body }).then((r) => r.data);

  getContactTasks = (id: string) =>
    this.http.get(`/contacts/${id}/tasks`).then((r) => r.data);

  createContactTask = (id: string, data: Record<string, unknown>) =>
    this.http.post(`/contacts/${id}/tasks`, data).then((r) => r.data);

  // ── Opportunities ─────────────────────────────────────

  searchOpportunities = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/opportunities/", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  getOpportunity = (id: string) =>
    this.http.get(`/opportunities/${id}`).then((r) => r.data);

  createOpportunity = (data: Record<string, unknown>) =>
    this.http
      .post("/opportunities/", { locationId: this.locationId, ...data })
      .then((r) => r.data);

  updateOpportunity = (id: string, data: Record<string, unknown>) =>
    this.http.put(`/opportunities/${id}`, data).then((r) => r.data);

  deleteOpportunity = (id: string) =>
    this.http.delete(`/opportunities/${id}`).then((r) => r.data);

  updateOpportunityStatus = (id: string, status: string) =>
    this.http
      .patch(`/opportunities/${id}/status`, { status })
      .then((r) => r.data);

  getPipelines = () =>
    this.http
      .get("/opportunities/pipelines", {
        params: { locationId: this.locationId },
      })
      .then((r) => r.data);

  // ── Conversations ─────────────────────────────────────

  searchConversations = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/conversations/search", {
        params: { locationId: this.locationId, ...params },
        ...this.convHeaders(),
      })
      .then((r) => r.data);

  getConversation = (
    id: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/conversations/${id}`, { params, ...this.convHeaders() })
      .then((r) => r.data);

  sendSms = (data: Record<string, unknown>) =>
    this.http
      .post(
        "/conversations/messages",
        { locationId: this.locationId, type: "SMS", ...data },
        this.convHeaders(),
      )
      .then((r) => r.data);

  sendEmail = (data: Record<string, unknown>) =>
    this.http
      .post(
        "/conversations/emails",
        { locationId: this.locationId, ...data },
        this.convHeaders(),
      )
      .then((r) => r.data);

  updateConversation = (id: string, data: Record<string, unknown>) =>
    this.http
      .put(
        `/conversations/${id}`,
        { locationId: this.locationId, ...data },
        this.convHeaders(),
      )
      .then((r) => r.data);

  deleteConversation = (id: string) =>
    this.http
      .delete(`/conversations/${id}`, this.convHeaders())
      .then((r) => r.data);

  // ── Calendar ──────────────────────────────────────────

  getCalendars = () =>
    this.http
      .get("/calendars/", {
        params: { locationId: this.locationId },
        ...this.calHeaders(),
      })
      .then((r) => r.data);

  getCalendarGroups = () =>
    this.http
      .get("/calendars/groups", { params: { locationId: this.locationId } })
      .then((r) => r.data);

  getCalendarEvents = (
    calendarId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/calendars/${calendarId}/events`, { params })
      .then((r) => r.data);

  getFreeSlots = (calendarId: string, data: Record<string, unknown>) =>
    this.http
      .post(`/calendars/${calendarId}/free-slots`, data)
      .then((r) => r.data);

  createAppointment = (data: Record<string, unknown>) =>
    this.http
      .post("/calendars/appointments", {
        locationId: this.locationId,
        ...data,
      })
      .then((r) => r.data);

  updateAppointment = (id: string, data: Record<string, unknown>) =>
    this.http.put(`/calendars/appointments/${id}`, data).then((r) => r.data);

  deleteAppointment = (id: string) =>
    this.http.delete(`/calendars/appointments/${id}`).then((r) => r.data);

  // ── Invoices ──────────────────────────────────────────

  listInvoices = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/invoices/", { params: { altId: this.locationId, ...params } })
      .then((r) => r.data);

  getInvoice = (id: string) =>
    this.http
      .get(`/invoices/${id}`, { params: { altId: this.locationId } })
      .then((r) => r.data);

  createInvoice = (data: Record<string, unknown>) =>
    this.http
      .post("/invoices/", { altId: this.locationId, ...data })
      .then((r) => r.data);

  updateInvoice = (id: string, data: Record<string, unknown>) =>
    this.http.put(`/invoices/${id}`, data).then((r) => r.data);

  sendInvoice = (id: string, data: Record<string, unknown> = {}) =>
    this.http
      .post(`/invoices/${id}/send`, { altId: this.locationId, ...data })
      .then((r) => r.data);

  generateInvoiceNumber = () =>
    this.http
      .get("/invoices/generate-number", {
        params: { altId: this.locationId },
      })
      .then((r) => r.data);

  listInvoiceTemplates = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/invoices/template", {
        params: { altId: this.locationId, altType: "location", ...params },
      })
      .then((r) => r.data);

  createInvoiceTemplate = (data: Record<string, unknown>) =>
    this.http
      .post("/invoices/template", {
        altId: this.locationId,
        altType: "location",
        ...data,
      })
      .then((r) => r.data);

  getInvoiceTemplate = (templateId: string) =>
    this.http
      .get(`/invoices/template/${templateId}`, {
        params: { altId: this.locationId },
      })
      .then((r) => r.data);

  deleteInvoiceTemplate = (templateId: string) =>
    this.http
      .delete(`/invoices/template/${templateId}`, {
        params: { altId: this.locationId },
      })
      .then((r) => r.data);

  voidInvoice = (invoiceId: string) =>
    this.http
      .post(`/invoices/${invoiceId}/void`, {
        altId: this.locationId,
        altType: "location",
      })
      .then((r) => r.data);

  recordPayment = (invoiceId: string, data: Record<string, unknown>) =>
    this.http
      .post(`/invoices/${invoiceId}/record-payment`, {
        altId: this.locationId,
        altType: "location",
        ...data,
      })
      .then((r) => r.data);

  deleteInvoice = (invoiceId: string) =>
    this.http
      .delete(`/invoices/${invoiceId}`, {
        params: { altId: this.locationId },
      })
      .then((r) => r.data);

  // ── Estimates ─────────────────────────────────────────

  createEstimate = (data: Record<string, unknown>) =>
    this.http
      .post("/estimates/", {
        altId: this.locationId,
        altType: "location",
        ...data,
      })
      .then((r) => r.data);

  listEstimates = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/estimates/", {
        params: { altId: this.locationId, altType: "location", ...params },
      })
      .then((r) => r.data);

  sendEstimate = (estimateId: string, data: Record<string, unknown> = {}) =>
    this.http
      .post(`/estimates/${estimateId}/send`, {
        altId: this.locationId,
        ...data,
      })
      .then((r) => r.data);

  // ── Blog ──────────────────────────────────────────────

  getBlogSites = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/blogs/site/all", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  getBlogPosts = (
    blogId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get("/blogs/posts/all", {
        params: { locationId: this.locationId, blogId, ...params },
      })
      .then((r) => r.data);

  createBlogPost = (data: Record<string, unknown>) =>
    this.http
      .post("/blogs/posts", { locationId: this.locationId, ...data })
      .then((r) => r.data);

  updateBlogPost = (postId: string, data: Record<string, unknown>) =>
    this.http
      .put(`/blogs/posts/${postId}`, { locationId: this.locationId, ...data })
      .then((r) => r.data);

  getBlogAuthors = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/blogs/authors", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  getBlogCategories = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/blogs/categories", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  checkUrlSlug = (params: Record<string, string | number>) =>
    this.http
      .get("/blogs/posts/url-slug-exists", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  // ── Location ──────────────────────────────────────────

  searchLocations = (params: Record<string, string | number> = {}) =>
    this.http.get("/locations/search", { params }).then((r) => r.data);

  getLocation = (locationId: string) =>
    this.http.get(`/locations/${locationId}`).then((r) => r.data);

  createLocation = (data: Record<string, unknown>) =>
    this.http.post("/locations/", data).then((r) => r.data);

  updateLocation = (locationId: string, data: Record<string, unknown>) =>
    this.http.put(`/locations/${locationId}`, data).then((r) => r.data);

  deleteLocation = (
    locationId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .delete(`/locations/${locationId}`, { params })
      .then((r) => r.data);

  getLocationTags = (locationId: string) =>
    this.http.get(`/locations/${locationId}/tags`).then((r) => r.data);

  createLocationTag = (locationId: string, data: Record<string, unknown>) =>
    this.http.post(`/locations/${locationId}/tags`, data).then((r) => r.data);

  updateLocationTag = (
    locationId: string,
    tagId: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .put(`/locations/${locationId}/tags/${tagId}`, data)
      .then((r) => r.data);

  deleteLocationTag = (locationId: string, tagId: string) =>
    this.http
      .delete(`/locations/${locationId}/tags/${tagId}`)
      .then((r) => r.data);

  getLocationCustomFields = (
    locationId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/locations/${locationId}/customFields`, { params })
      .then((r) => r.data);

  createLocationCustomField = (
    locationId: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .post(`/locations/${locationId}/customFields`, data)
      .then((r) => r.data);

  updateLocationCustomField = (
    locationId: string,
    id: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .put(`/locations/${locationId}/customFields/${id}`, data)
      .then((r) => r.data);

  deleteLocationCustomField = (locationId: string, id: string) =>
    this.http
      .delete(`/locations/${locationId}/customFields/${id}`)
      .then((r) => r.data);

  getLocationCustomValues = (locationId: string) =>
    this.http.get(`/locations/${locationId}/customValues`).then((r) => r.data);

  createLocationCustomValue = (
    locationId: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .post(`/locations/${locationId}/customValues`, data)
      .then((r) => r.data);

  updateLocationCustomValue = (
    locationId: string,
    id: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .put(`/locations/${locationId}/customValues/${id}`, data)
      .then((r) => r.data);

  deleteLocationCustomValue = (locationId: string, id: string) =>
    this.http
      .delete(`/locations/${locationId}/customValues/${id}`)
      .then((r) => r.data);

  getLocationTemplates = (
    locationId: string,
    params: Record<string, string | number>,
  ) =>
    this.http
      .get(`/locations/${locationId}/templates`, { params })
      .then((r) => r.data);

  searchLocationTasks = (locationId: string, data: Record<string, unknown>) =>
    this.http
      .post(`/locations/${locationId}/tasks/search`, data)
      .then((r) => r.data);

  // ── Social Media ──────────────────────────────────────

  searchSocialPosts = (data: Record<string, unknown>) =>
    this.http
      .post(`/social-media-posting/${this.locationId}/posts/list`, data)
      .then((r) => r.data);

  createSocialPost = (data: Record<string, unknown>) =>
    this.http
      .post(`/social-media-posting/${this.locationId}/posts`, data)
      .then((r) => r.data);

  getSocialPost = (postId: string) =>
    this.http
      .get(`/social-media-posting/${this.locationId}/posts/${postId}`)
      .then((r) => r.data);

  updateSocialPost = (postId: string, data: Record<string, unknown>) =>
    this.http
      .put(`/social-media-posting/${this.locationId}/posts/${postId}`, data)
      .then((r) => r.data);

  deleteSocialPost = (postId: string) =>
    this.http
      .delete(`/social-media-posting/${this.locationId}/posts/${postId}`)
      .then((r) => r.data);

  bulkDeleteSocialPosts = (data: Record<string, unknown>) =>
    this.http
      .post(`/social-media-posting/${this.locationId}/posts/bulk-delete`, data)
      .then((r) => r.data);

  getSocialAccounts = () =>
    this.http
      .get(`/social-media-posting/${this.locationId}/accounts`)
      .then((r) => r.data);

  deleteSocialAccount = (
    accountId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .delete(
        `/social-media-posting/${this.locationId}/accounts/${accountId}`,
        { params },
      )
      .then((r) => r.data);

  // ── Email ─────────────────────────────────────────────

  getEmailCampaigns = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/emails/schedule", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  createEmailTemplate = (data: Record<string, unknown>) =>
    this.http
      .post("/emails/builder", {
        locationId: this.locationId,
        type: "html",
        ...data,
      })
      .then((r) => r.data);

  getEmailTemplates = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/emails/builder", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  updateEmailTemplate = (templateId: string, data: Record<string, unknown>) =>
    this.http
      .post("/emails/builder/data", {
        locationId: this.locationId,
        templateId,
        editorType: "html",
        ...data,
      })
      .then((r) => r.data);

  deleteEmailTemplate = (templateId: string) =>
    this.http
      .delete(`/emails/builder/${this.locationId}/${templateId}`)
      .then((r) => r.data);

  // ── Media ─────────────────────────────────────────────

  getMediaFiles = (params: Record<string, string | number> = {}) =>
    this.http.get("/medias/files", { params }).then((r) => r.data);

  uploadMediaFile = (data: Record<string, unknown>) =>
    this.http.post("/medias/upload-file", data).then((r) => r.data);

  deleteMediaFile = (id: string, params: Record<string, string | number>) =>
    this.http.delete(`/medias/${id}`, { params }).then((r) => r.data);

  // ── Workflows ─────────────────────────────────────────

  getWorkflows = () =>
    this.http
      .get("/workflows/", { params: { locationId: this.locationId } })
      .then((r) => r.data);

  // ── Surveys ───────────────────────────────────────────

  getSurveys = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/surveys/", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  getSurveySubmissions = (params: Record<string, string | number> = {}) =>
    this.http
      .get(`/locations/${this.locationId}/surveys/submissions`, { params })
      .then((r) => r.data);

  // ── Products ──────────────────────────────────────────

  createProduct = (data: Record<string, unknown>) =>
    this.http.post("/products/", data).then((r) => r.data);

  updateProduct = (productId: string, data: Record<string, unknown>) =>
    this.http.put(`/products/${productId}`, data).then((r) => r.data);

  getProduct = (productId: string) =>
    this.http
      .get(`/products/${productId}`, {
        params: { locationId: this.locationId },
      })
      .then((r) => r.data);

  listProducts = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/products/", {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  deleteProduct = (productId: string) =>
    this.http
      .delete(`/products/${productId}`, {
        params: { locationId: this.locationId },
      })
      .then((r) => r.data);

  createPrice = (productId: string, data: Record<string, unknown>) =>
    this.http
      .post(`/products/${productId}/price`, {
        locationId: this.locationId,
        ...data,
      })
      .then((r) => r.data);

  listPrices = (
    productId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/products/${productId}/price`, {
        params: { locationId: this.locationId, ...params },
      })
      .then((r) => r.data);

  listProductCollections = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/products/collections", {
        params: { altId: this.locationId, altType: "location", ...params },
      })
      .then((r) => r.data);

  createProductCollection = (data: Record<string, unknown>) =>
    this.http
      .post("/products/collections", {
        altId: this.locationId,
        altType: "location",
        ...data,
      })
      .then((r) => r.data);

  listInventory = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/products/inventory", {
        params: { altId: this.locationId, altType: "location", ...params },
      })
      .then((r) => r.data);

  // ── Payments ──────────────────────────────────────────

  listOrders = (params: Record<string, string | number> = {}) =>
    this.http
      .get("/payments/orders", {
        params: { altId: this.locationId, altType: "location", ...params },
      })
      .then((r) => r.data);

  getOrder = (orderId: string, params: Record<string, string | number> = {}) =>
    this.http
      .get(`/payments/orders/${orderId}`, { params })
      .then((r) => r.data);

  listTransactions = (params: Record<string, string | number> = {}) =>
    this.http.get("/payments/transactions", { params }).then((r) => r.data);

  getTransaction = (
    transactionId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/payments/transactions/${transactionId}`, { params })
      .then((r) => r.data);

  listSubscriptions = (params: Record<string, string | number> = {}) =>
    this.http.get("/payments/subscriptions", { params }).then((r) => r.data);

  getSubscription = (
    subscriptionId: string,
    params: Record<string, string | number> = {},
  ) =>
    this.http
      .get(`/payments/subscriptions/${subscriptionId}`, { params })
      .then((r) => r.data);

  listCoupons = (params: Record<string, string | number> = {}) =>
    this.http.get("/payments/coupon/list", { params }).then((r) => r.data);

  createCoupon = (data: Record<string, unknown>) =>
    this.http.post("/payments/coupon", data).then((r) => r.data);

  getCoupon = (params: Record<string, string | number>) =>
    this.http.get("/payments/coupon", { params }).then((r) => r.data);

  // ── Objects (Custom) ──────────────────────────────────

  listObjects = () =>
    this.http
      .get("/objects/", { params: { locationId: this.locationId } })
      .then((r) => r.data);

  createObjectSchema = (data: Record<string, unknown>) =>
    this.http
      .post("/objects/", { locationId: this.locationId, ...data })
      .then((r) => r.data);

  getObjectSchema = (key: string) =>
    this.http
      .get(`/objects/${key}`, { params: { locationId: this.locationId } })
      .then((r) => r.data);

  updateObjectSchema = (key: string, data: Record<string, unknown>) =>
    this.http
      .put(`/objects/${key}`, { locationId: this.locationId, ...data })
      .then((r) => r.data);

  createObjectRecord = (schemaKey: string, data: Record<string, unknown>) =>
    this.http
      .post(`/objects/${schemaKey}/records`, {
        locationId: this.locationId,
        ...data,
      })
      .then((r) => r.data);

  getObjectRecord = (schemaKey: string, id: string) =>
    this.http.get(`/objects/${schemaKey}/records/${id}`).then((r) => r.data);

  updateObjectRecord = (
    schemaKey: string,
    id: string,
    data: Record<string, unknown>,
  ) =>
    this.http
      .put(`/objects/${schemaKey}/records/${id}`, data)
      .then((r) => r.data);

  deleteObjectRecord = (schemaKey: string, id: string) =>
    this.http.delete(`/objects/${schemaKey}/records/${id}`).then((r) => r.data);

  searchObjectRecords = (schemaKey: string, data: Record<string, unknown>) =>
    this.http
      .post(`/objects/${schemaKey}/records/search`, {
        locationId: this.locationId,
        ...data,
      })
      .then((r) => r.data);
}
