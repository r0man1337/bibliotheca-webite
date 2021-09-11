<template>
  <section>
    <div>
      <h1 class="mb-12">Bibliotheca (for Loot)</h1>
      <h3 class="mb-4 text-gray-500">What is Loot Bibliotheca (for Adventurers)?</h3>
      <p class="sm:text-2xl">Bibliotheca is your resource for your Adventures. <br>Bibliotheca graphs community projects so you can see your progress in the Lootverse.</p>
      <p class="my-4">Biliotheca is all open source and we encourge community PRs.</p>
      <div class="flex flex-wrap">
        <div class="bg-black p-4 rounded-xl w-80 h-80 mt-10 text-3xl cursor-pointer transform hover:-translate-y-2 transition duration-150 flex flex-col sm:mr-4" @click="$router.push('/adventurer')">

          <div class="mt-auto">
            See all Adventurers
          </div>
          
        </div>
        <div class="bg-black p-4 rounded-xl w-80 h-80 mt-10 text-3xl cursor-pointer transform hover:-translate-y-2 transition duration-150 flex flex-col" @click="$router.push('/realms')">

          <div class="mt-auto">
            See all Realms
          </div>
          
        </div>
      </div>

      <div class="my-8">
        <h2 class="my-4">Bibliotheca Road Map (this may change rapidly)</h2>
        <h3 class="mt-4">Stage 1</h3>
        <ol class="text-xl">
          <li>Continuous iteration of UI and UX via community discussion.</li>
          <li>Include other major Loot community projects in the dashboard.</li>
        </ol>
        <h3 class="mt-4">Stage 2</h3>
        <ol class="text-xl">
          <li>Community voting via a DAO for the Realm Lords to include other derivative projects.</li> 
          <li>Utility with the realms.</li>
        </ol>
      </div>
    </div>
  </section>
</template>

