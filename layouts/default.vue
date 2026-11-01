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
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Sidebar -->
    <div class="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed top-0 bottom-0 left-0 overflow-y-auto">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-30 h-30 rounded-lg flex items-center justify-center">
            <img alt="GPAK Logo" src="assets/img/gpak.jpeg" style="height: 30px;" />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <!-- Changed item in navigation to item in filteredNavigation -->
        <template v-for="item in filteredNavigation" :key="item.name">
          
          <!-- Menu Item without children -->
          <NuxtLink 
            v-if="!item.children"
            :to="item.href" 
            class="sidebar-item"
            :class="{ 'active': $route.path === item.href }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </NuxtLink>

          <!-- Menu Item with children (Dropdown) -->
          <div v-else class="space-y-1">
            <button 
              @click="toggleMenu(item.name)"
              class="sidebar-item w-full flex items-center justify-between"
              :class="{ 'active': openMenus[item.name] || hasActiveChild(item.children) }"
            >
              <div class="flex items-center">
                <component :is="item.icon" class="w-5 h-5 mr-3" />
                <span>{{ item.name }}</span>
              </div>
              <ChevronDown 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': openMenus[item.name] }"
              />
            </button>

            <!-- Dropdown Children -->
            <div 
              v-show="openMenus[item.name]"
              class="pl-6 space-y-1 animate-fade-in"
            >
              <NuxtLink 
                v-for="child in item.children"
                :key="child.name"
                :to="child.href" 
                class="sidebar-item text-sm"
                :class="{ 'active': $route.path === child.href }"
              >
                <component :is="child.icon" class="w-4 h-4 mr-3" v-if="child.icon" />
                {{ child.name }}
              </NuxtLink>
            </div>
          </div>

        </template>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <img 
            src="https://res.cloudinary.com/rhyoliteprime/image/upload/v1533814738/images_6.png" 
            alt="Evano" 
            class="w-10 h-10 rounded-full object-cover"
          >
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900"> {{ tenantName }}/{{ userName }}</p>
            <p class="text-xs text-gray-500"></p>
          </div>
          <button 
            @click="logout"
            class="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Hello {{ userName }} 👋</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
               <!-- user profile avatar in top corner -->
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

* {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
}
</style>