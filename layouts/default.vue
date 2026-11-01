<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
// Assumes you have useUserStore and useAuth defined automatically by Nuxt auto-imports or explicitly imported here

import { 
  LayoutDashboard, 
  LogIn,
  Percent, 
  Users,
  HelpCircle,
  ChevronRight, 
  ChevronDown,
  Search,
  FileText,
  Receipt,
  LogOut,
  Settings,
  BarChart2,
  UserCog,
  PlayCircle,
  LayoutGrid,
  Type,
  Calendar,
  Shield,
  ClipboardList,
  DollarSign,
  CreditCard,
  Monitor,
  TrendingUp,
  Package,
  Building,
  Cpu,
  GitBranch,
  ClipboardCheck,
  Boxes,
  FileSignature,
  PackageCheck,
  Factory,
  Activity,
  Tags
} from 'lucide-vue-next'

const userStore = useUserStore()
const { signOut } = useAuth();
const route = useRoute();
const mobileMenuOpen = ref(false);
watch(() => route.path, () => { mobileMenuOpen.value = false });

// --- Navigation Configuration ---
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'Dashboard.view' },
  { name: 'Production Requests', href: '/production-requests', icon: Factory, permission: 'Production Request.View' },
  {
    name: 'Estimates',
    icon: FileText,
    permission: 'Estimate.View',
    children: [
      { name: 'Estimate List', href: '/estimates', icon: LayoutGrid },
      { name: 'Templates', href: '/estimates/templates', icon: ClipboardList }
    ]
  },
  { name: 'Quotation', href: '/quotations', icon: FileText, permission: 'Quotation.View' },
  { name: 'Work Instruction Sheet', href: '/production-planning', icon: Calendar },
  {
    name: 'Production Execution',
    icon: PlayCircle,
    children: [
      { name: 'Active Work Orders', href: '/production-execution/work-orders', icon: Activity },
      { name: 'Finished Goods', href: '/production-execution/finished-goods', icon: PackageCheck },
      { name: 'Post Production Analysis', href: '/production-execution/analysis', icon: TrendingUp }
    ]
  },
  {
    name: 'Inventory',
    icon: Monitor,
    children: [
      { name: 'Categories', href: '/inventory/categories', icon: LayoutGrid },
      { name: 'Inventory Items', href: '/inventory/inventory-items', icon: Boxes },
      { name: 'Finished Goods', href: '/inventory/finished-goods', icon: PackageCheck }
    ]
  },
  {
    name: 'Setups',
    icon: Settings,
    children: [
      { name: 'Products', href: '/setups/products', icon: Package },
      { name: 'Departments', href: '/setups/departments', icon: Building },
      { name: 'Work Centers', href: '/setups/work-centers', icon: Cpu },
      { name: 'Workflows', href: '/setups/workflows', icon: GitBranch },
      { name: 'Finishing Options', href: '/setups/finishing-options', icon: ClipboardCheck },
      { name: 'Formula Builder', href: '/setups/formula-builder', icon: Activity },
      { name: 'Estimate Types', href: '/setups/estimates-types', icon: Tags },
      { name: 'QC Checklist', href: '/setups/qc-checklist', icon: ClipboardCheck },
      { name: 'Tax Rates', href: '/setups/tax-rates', icon: Percent },
      { name: 'Unit of Measure', href: '/setups/uom', icon: Type },
      { name: 'Signatories', href: '/setups/signatories', icon: FileSignature }
    ]
  },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Payments', href: '/payments', icon: Receipt },
  {
    name: 'Reports',
    icon: BarChart2,
    children: [
      { name: 'Overview', href: '/reports/overview', icon: TrendingUp },
      { name: 'Production Requests', href: '/reports/advert-placements', icon: Monitor },
      { name: 'Customer Analytics', href: '/reports/customers', icon: Users },
      { name: 'Invoice Reports', href: '/reports/invoices', icon: FileText },
      { name: 'Payment Analysis', href: '/reports/payments', icon: CreditCard },
      { name: 'Financial Summary', href: '/reports/financial', icon: DollarSign }
    ]
  },
  {
    name: 'User Management',
    icon: UserCog,
    children: [
      { name: 'Roles', href: '/user-management/roles', icon: Shield },
      { name: 'Users', href: '/user-management/users', icon: Users }
    ]
  }
];

// --- Permissions State & Logic ---
const userPermissions = ref([]);

// Retrieve permissions from IndexedDB
const getPermissionsFromIndexedDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve([]);
      return;
    }
    const request = indexedDB.open('GpakCrmAuthDB', 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('permissions')) {
        resolve([]);
        return;
      }
      const transaction = db.transaction('permissions', 'readonly');
      const store = transaction.objectStore('permissions');
      const getRequest = store.get('user_permissions');
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result || []);
      };
      getRequest.onerror = () => resolve([]);
    };
    request.onerror = () => resolve([]);
  });
};

// Filter Navigation based on permissions
const filteredNavigation = computed(() => {
  return navigation.map(item => {
    // Clone the item to avoid mutating the original array
    const clonedItem = { ...item };

    // If it has children, filter the children first
    if (clonedItem.children) {
      clonedItem.children = clonedItem.children.filter(child => {
        if (!child.permission) return true; // Show if no permission required
        return userPermissions.value.some(
          p => p.toLowerCase() === child.permission.toLowerCase()
        );
      });
    }
    return clonedItem;
  }).filter(item => {
    // Then filter the parent item based on its own permissions
    if (item.permission) {
      return userPermissions.value.some(
        p => p.toLowerCase() === item.permission.toLowerCase()
      );
    }
    
    // Optional: Hide a parent menu if it had children originally, but all were filtered out
    if (item.children && item.children.length === 0 && navigation.find(n => n.name === item.name).children) {
        return false;
    }
    
    return true; // Show if no permission required
  });
});


// --- Menu State Management ---
const openMenus = ref({});

const hasActiveChild = (children) => {
  if (!children) return false;
  return children.some(child => route.path === child.href || route.path.startsWith(child.href + '/'));
};

const toggleMenu = (name) => {
  const isCurrentlyOpen = openMenus.value[name];
  
  // 1. Close all open menus first (Accordion behavior)
  Object.keys(openMenus.value).forEach(key => {
    openMenus.value[key] = false;
  });

  // 2. Open the clicked menu if it wasn't already open
  if (!isCurrentlyOpen) {
    openMenus.value[name] = true;
  }
};

// 3. Watch for route changes to automatically open the correct parent and CLOSE all others
// Updated to watch both the route AND the dynamic filteredNavigation
watch(
  [() => route.path, filteredNavigation],
  () => {
    filteredNavigation.value.forEach(item => {
      if (item.children) {
        // This ensures ONLY the parent of the currently active route stays open
        openMenus.value[item.name] = hasActiveChild(item.children);
      }
    });
  },
  { immediate: true, deep: true } 
);


// --- User Profile State ---
const userName = ref("");
const tenantName = ref("");
const userEmail = ref("");

const logout = () => {
  userStore.clearUser();
  signOut();
}

const getUserAccount = async () => {
  try {
    let result = await getUserAccountDetails();

    // Save in Pinia + localStorage
    userStore.setUser(result.user);
    userStore.setTenant(result.tenant);

    // Also set in refs for display
    userName.value = result.user.name;
    tenantName.value = result.tenant.name;
    userEmail.value = result.user.emailAddress;

  } catch (error) {
    console.error('Unable to fetch user details!', error);
  }
}

onMounted(async () => {
  // Load permissions asynchronously
  userPermissions.value = await getPermissionsFromIndexedDB();
  
  userStore.loadFromLocalStorage();
  
  if (!userStore.user || !userStore.tenant) {
    await getUserAccount();
  } else {
    userName.value = userStore.user.name;
    tenantName.value = userStore.tenant.name;
    userEmail.value = userStore.user.emailAddress;
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f8f7] text-[#202b29] lg:flex">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="mobileMenuOpen = false"></div>
    <aside :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-[#e7eae7] bg-white transition-transform duration-200 lg:translate-x-0">
      <div class="flex h-[86px] items-center gap-3 px-6">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b52931] text-lg font-black text-white">G</div>
        <div><div class="text-xl font-extrabold tracking-[-0.07em] text-[#252e2c]">GPAK<span class="text-[#b52931]">.</span></div><div class="text-[9px] font-bold uppercase tracking-[0.19em] text-[#98a09d]">Print &amp; packaging</div></div>
      </div>
      <div class="px-6 pb-3 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1aaa5]">Workspace</div>
      <nav class="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
        <template v-for="item in filteredNavigation" :key="item.name">
          <NuxtLink v-if="!item.children" :to="item.href" class="nav-item" :class="{ 'nav-active': $route.path === item.href }">
            <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" /><span>{{ item.name }}</span>
          </NuxtLink>
          <div v-else>
            <button class="nav-item w-full" :class="{ 'nav-active': hasActiveChild(item.children) }" :aria-expanded="!!openMenus[item.name]" @click="toggleMenu(item.name)">
              <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" /><span class="flex-1 text-left">{{ item.name }}</span><ChevronDown class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openMenus[item.name] }" />
            </button>
            <div v-show="openMenus[item.name]" class="ml-6 border-l border-[#e8ebe8] pl-3">
              <NuxtLink v-for="child in item.children" :key="child.name" :to="child.href" class="nav-item text-xs" :class="{ 'nav-active': $route.path === child.href }">{{ child.name }}</NuxtLink>
            </div>
          </div>
        </template>
      </nav>
      <div class="border-t border-[#eef0ee] p-4">
        <div class="flex items-center gap-3 rounded-xl bg-[#f6f8f6] p-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4ebe6] text-xs font-bold text-[#52705d]">{{ (userName || 'G').charAt(0).toUpperCase() }}</div>
          <div class="min-w-0 flex-1"><p class="truncate text-xs font-bold">{{ userName || 'GPAK User' }}</p><p class="truncate text-[11px] text-[#8b9690]">{{ tenantName || 'Backoffice' }}</p></div>
          <button title="Sign out" aria-label="Sign out" class="text-[#98a29c] hover:text-[#b52931]" @click="logout"><LogOut class="h-4 w-4" /></button>
        </div>
      </div>
    </aside>
    <div class="min-w-0 flex-1 lg:ml-[250px]">
      <header class="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e9ece9] bg-white/95 px-5 backdrop-blur-md md:px-9">
        <div class="flex items-center gap-3"><button class="rounded-lg p-2 text-[#53615a] hover:bg-gray-100 lg:hidden" aria-label="Open navigation" @click="mobileMenuOpen = true"><LayoutGrid class="h-5 w-5" /></button><span class="text-sm text-[#98a39c]">Workspace</span><ChevronRight class="h-4 w-4 text-[#c4cbc6]" /><span class="text-sm font-semibold text-[#34413b]">{{ $route.path === '/' ? 'Dashboard' : ($route.path.split('/').filter(Boolean).pop() || 'Dashboard').replace(/-/g, ' ') }}</span></div>
        <div class="flex items-center gap-3"><span class="hidden text-xs text-[#8b9690] sm:block">GPAK Backoffice</span><span class="h-7 w-px bg-[#e8ece8]"></span><div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5eee7] text-xs font-bold text-[#496652]">{{ (userName || 'G').charAt(0).toUpperCase() }}</div></div>
      </header>
      <main class="mx-auto max-w-[1600px] p-5 md:p-9"><slot /></main>
    </div>
  </div>
</template>

<style scoped>
.nav-item { display:flex; align-items:center; gap:12px; min-height:41px; border-radius:8px; padding:10px 12px; color:#69766f; font-size:13px; font-weight:500; transition:all .2s; }
.nav-item:hover { background:#f5f7f5; color:#263b2e; }
.nav-active, .nav-active:hover { background:#eef4ef; color:#315b40; font-weight:700; }
</style>
