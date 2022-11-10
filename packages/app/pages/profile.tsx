import { useUser, withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0'
import Script from 'next/script'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { tw } from 'twind'
import { User } from '../lib/directus/types'
import fetcher from '../lib/utils/helpers'

type Profile = UserProfile & User

const ProfileCard = ({ profile }: { profile: Profile}) => {
  
  return <>
  <section className={tw`bg-gray-900`}>
    <div className={tw`max-w-2xl px-4 py-8 mx-auto lg:py-16 text-left`}>
      <form action="#">
          <h2 className={tw`mb-4 text-6xl font-semibold leading-none text-white`}>Profile Information</h2>
          <div className={tw`grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8`}>
              <div className={tw`sm:col-span-2`}>
                  <label className={tw`block mb-2 text-sm font-medium text-white`} htmlFor="file_input">Upload avatar</label>
                  <div className={tw`items-center w-full sm:flex`}>
                      { profile?.picture && <Image className={tw`w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0`} src={profile?.picture||''} alt={profile?.name||''}/>}
                      <div className={tw`w-full`}>
                          <input className={tw`w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} aria-describedby="file_input_help" id="file_input" type="file"/>
                          <p className={tw`mt-1 text-xs font-normal text-gray-500 dark:text-gray-300`} id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                      </div>
                  </div>
              </div>
              <div>
                  <label htmlFor="first-name" className={tw`block mb-2 text-sm font-medium text-white`}>First Name</label>
                  <input type="text" name="first-name" id="first-name" defaultValue={profile?.first_name||''}
                    className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} placeholder="Ex. John" required/>
              </div>
              <div>
                  <label htmlFor="last-name" className={tw`block mb-2 text-sm font-medium text-white`}>Last Name</label>
                  <input type="text" name="last-name" id="last-name"  defaultValue={profile?.last_name||''}
                    className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}  placeholder="Ex. Doe" required/>
              </div>
              <div>
                  <label htmlFor="email" className={tw`block mb-2 text-sm font-medium text-white`}>Email</label>
                  <input type="email" name="email" id="email"  defaultValue={profile?.email||''}
                    className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}  placeholder="Ex. name@company.com" required/>
              </div>
              <div>
                  <label htmlFor="user-permissions" className={tw`inline-flex items-center mb-2 text-sm font-medium text-white`}>
                      User Permissions
                      <button type="button" data-tooltip-target="tooltip-dark" data-tooltip-style="dark" className={tw`ml-1`}>
                          <svg aria-hidden="true" className={tw`w-4 h-4 text-gray-400 hover:text-gray-500 dark:hover:text-white`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                          <span className={tw`sr-only`}>Show information</span>
                      </button>
                      <div id="tooltip-dark" role="tooltip" className={tw`absolute z-10 invisible inline-block max-w-sm px-3 py-2 text-xs font-normal text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`}>
                          User permissions, part of the overall user management process, are access granted to users to specific resources such as files, applications, networks, or devices.
                          <div className={tw`tooltip-arrow`} data-popper-arrow></div>
                      </div>
                  </label>
                  <select id="user-permissions" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option>Operational</option>
                      <option >Non Operational</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="email-status" className={tw`inline-flex items-center mb-2 text-sm font-medium text-white`}>
                      Email Status
                      <button type="button" data-tooltip-target="tooltip-email-status" data-tooltip-style="dark" className={tw`ml-1`}>
                          <svg aria-hidden="true" className={tw`w-4 h-4 text-gray-400 hover:text-gray-500 dark:hover:text-white`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                          <span className={tw`sr-only`}>Show information</span>
                      </button>
                      <div id="tooltip-email-status" role="tooltip" className={tw`absolute z-10 invisible inline-block max-w-sm px-3 py-2 text-xs font-normal text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`}>
                          As an administrator, you can view the status of a user&rsquo;s email. The status indicates whether a user&rsquo;s email is verified or not.
                          <div className={tw`tooltip-arrow`} data-popper-arrow></div>
                      </div>
                  </label>
                  <select id="email-status" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option>Verified</option>
                      <option>Not Verified</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="job-title" className={tw`block mb-2 text-sm font-medium text-white`}>Job Title</label>
                  <input type="text" name="job-title" id="job-title" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'React Developer'} placeholder="e.g React Native Developer" required/>
              </div>
              <div>
                  <label htmlFor="user-role" className={tw`inline-flex items-center mb-2 text-sm font-medium text-white`}>
                      User Role
                      <button type="button" data-tooltip-target="tooltip-user-role" data-tooltip-style="dark" className={tw`ml-1`}>
                          <svg aria-hidden="true" className={tw`w-4 h-4 text-gray-400 hover:hover:text-white dark:text-gray-500`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                          <span className={tw`sr-only`}>Show information</span>
                      </button>
                      <div id="tooltip-user-role" role="tooltip" className={tw`absolute z-10 invisible inline-block max-w-sm px-3 py-2 text-xs font-normal text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`}>
                          Flowbite provides 7 predefined roles: Owner, Admin, Editor, Contributor and Viewer. Assign the most suitable role to each user, giving them the most appropriate level of control.
                          <div className={tw`tooltip-arrow`} data-popper-arrow></div>
                      </div>
                  </label>
                  <select id="user-role" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option >Owner</option>
                      <option value={'AD'}>Admin</option>
                      <option value={'ED'}>Editor</option>
                      <option value={'CO'}>Contributor</option>
                      <option value={'VI'}>Viewer</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="account" className={tw`inline-flex items-center mb-2 text-sm font-medium text-white`}>
                      Account
                      <button type="button" data-tooltip-target="tooltip-account" data-tooltip-style="dark" className={tw`ml-1`}>
                          <svg aria-hidden="true" className={tw`w-4 h-4 text-gray-400 hover:hover:text-white dark:text-gray-500`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                          <span className={tw`sr-only`}>Show information</span>
                      </button>
                      <div id="tooltip-account" role="tooltip" className={tw`absolute z-10 invisible inline-block max-w-sm px-3 py-2 text-xs font-normal text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`}>
                          Choose here your account type.
                          <div className={tw`tooltip-arrow`} data-popper-arrow></div>
                      </div>
                  </label>
                  <select id="account" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option>PRO Account</option>
                      <option>Default Account</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="password" className={tw`block mb-2 text-sm font-medium text-white`}>Password</label>
                  <input type="password" name="password" id="password" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="" placeholder="•••••••••" required/>
              </div>                        
              <div>
                  <label htmlFor="confirm-password" className={tw`block mb-2 text-sm font-medium text-white`}>Confirm password</label>
                  <input type="password" name="confirm-password" id="confirm-password" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="" placeholder="•••••••••" required/>
              </div>
              <div className={tw`sm:col-span-2`}>
                  <label htmlFor="biography" className={tw`block mb-2 text-sm font-medium text-white`}>Biography</label>
                  <div className={tw`w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600`}>
                      <div className={tw`flex items-center justify-between px-3 py-2 border-b dark:border-gray-600`}>
                          <div className={tw`flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600`}>
                              <div className={tw`flex items-center space-x-1 sm:pr-4`}>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Attach file</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Embed map</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Upload image</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Format code</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Add emoji</span>
                                  </button>
                              </div>
                              <div className={tw`flex-wrap items-center hidden space-x-1 sm:flex sm:pl-4`}>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Add list</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>       
                                      <span className={tw`sr-only`}>Settings</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Timeline</span>
                                  </button>
                                  <button type="button" className={tw`p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                                      <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                      <span className={tw`sr-only`}>Download</span>
                                  </button>
                              </div>
                          </div>
                          <button type="button" data-tooltip-target="tooltip-fullscreen" className={tw`p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600`}>
                              <svg aria-hidden="true" className={tw`w-5 h-5`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                              <span className={tw`sr-only`}>Full screen</span>
                          </button>
                          <div id="tooltip-fullscreen" role="tooltip" className={tw`absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`} data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom">
                              Show full screen
                              <div className={tw`tooltip-arrow`} data-popper-arrow=""></div>
                          </div>
                      </div>
                      <div className={tw`px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800`}>
                          <textarea id="biography" rows={8} className={tw`block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400`} placeholder="Write a message here" required>
                          </textarea>
                      </div>
                  </div>
              </div>
              <div>
                  <label className={tw`block mb-2 text-sm font-medium text-white`} htmlFor="file_input">Assign Role</label>
                  <div className={tw`flex items-center space-x-4`}>
                      <div className={tw`flex items-center`}>
                          <input id="inline-checkbox" type="checkbox" defaultValue="" name="role_checkbox" className={tw`w-4 h-4 bg-gray-100 border-gray-300 rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}/>
                          <label htmlFor="inline-checkbox" className={tw`ml-2 text-sm font-medium text-gray-300`}>Administrator</label>
                      </div>
                      <div className={tw`flex items-center`}>
                          <input id="inline-2-checkbox" type="checkbox" defaultValue="" name="role_checkbox" className={tw`w-4 h-4 bg-gray-100 border-gray-300 rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}/>
                          <label htmlFor="inline-2-checkbox" className={tw`ml-2 text-sm font-medium text-gray-300`}>Member</label>
                      </div>
                      <div className={tw`flex items-center`}>
                          <input defaultChecked={false} id="inline-checked-checkbox" type="checkbox" defaultValue="" name="role_checkbox" className={tw`w-4 h-4 bg-gray-100 border-gray-300 rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}/>
                          <label htmlFor="inline-checked-checkbox" className={tw`ml-2 text-sm font-medium text-gray-300`}>Viewer</label>
                      </div>
                  </div>
              </div>
          </div>
          <h2 className={tw`mb-4 text-xl font-semibold leading-none text-white`}>Additional Information</h2>
          <div className={tw`grid gap-4 mb-4 md:gap-6 md:grid-cols-2 sm:mb-8`}>
              <div>
                  <label htmlFor="country" className={tw`mb-2 text-sm font-medium text-white`}>Country</label>
                  <select id="country" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option>United States</option>
                      <option value={'NO'}>Australia</option>
                      <option value={'NO'}>United Kingdom</option>
                      <option value={'NO'}>Italy</option>
                      <option value={'NO'}>Germany</option>
                      <option value={'NO'}>Spain</option>
                      <option value={'NO'}>France</option>
                      <option value={'NO'}>Canada</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="city" className={tw`mb-2 text-sm font-medium text-white`}>City</label>
                  <select id="city" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}>
                      <option >Los Angeles</option>
                      <option value={'WA'}>Washington</option>
                      <option value={'NW'}>New York</option>
                      <option value={'SA'}>Sacramento</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="address" className={tw`block mb-2 text-sm font-medium text-white`}>Address</label>
                  <input type="text" name="address" id="address" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="92 Miles Drive, Newark, NJ 07103..." placeholder="Your Location" required/>
              </div>
              <div>
                  <label htmlFor="zip" className={tw`block mb-2 text-sm font-medium text-white`}>ZIP</label>
                  <input type="number" name="zip" id="zip" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'2124436'} placeholder="ZIP" required/>
              </div>
              <div>
                  <label htmlFor="timezone" className={tw`block mb-2 text-sm font-medium text-white`}>Timezone</label>
                  <input type="text" name="timezone" id="timezone" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="GMT+3" placeholder="e.g GMT+6" required/>
              </div>
              <div>
                  <label htmlFor="phone-number" className={tw`block mb-2 text-sm font-medium text-white`}>Phone Number</label>
                  <input type="number" name="phone-number" id="phone-number" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'3934567890'} placeholder="Add a phone number" required/>
              </div>

              <div>
                  <label htmlFor="linkedin" className={tw`block mb-2 text-sm font-medium text-white`}>Linkedin URL</label>
                  <input type="url" name="linkedin" id="linkedin" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="https://www.linkedin.com/in/helene-example/" placeholder="LinkedIn URL" required/>
              </div>
              <div>
                  <label htmlFor="facebook" className={tw`block mb-2 text-sm font-medium text-white`}>Facebook</label>
                  <input type="url" name="facebook" id="facebook" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'@helene.fb'} placeholder="Facebook Profile" required/>
              </div>
              <div>
                  <label htmlFor="github" className={tw`block mb-2 text-sm font-medium text-white`}>Github</label>
                  <input type="url" name="github" id="github" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'@helene'} placeholder="Github Username" required/>
              </div>
              <div>
                  <label htmlFor="dribbble" className={tw`block mb-2 text-sm font-medium text-white`}>Dribbble</label>
                  <input type="url" name="dribbble" id="dribbble" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'@helene.engels'} placeholder="Dribbble Username" required/>
              </div>
              <div>
                  <label htmlFor="instagram" className={tw`block mb-2 text-sm font-medium text-white`}>Instagram</label>
                  <input type="url" name="instagram" id="instagram" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue={'@helene.insta'} placeholder="Instagram Username" required/>
              </div>
              <div>
                  <label htmlFor="personal-website" className={tw`block mb-2 text-sm font-medium text-white`}>Personal Website</label>
                  <input type="url" name="personal-website" id="personal-website" className={tw`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`} defaultValue="http://www.example.com" placeholder="http://www.example.com" required/>
              </div>
          </div>
          <div className={tw`flex items-center space-x-4`}>
              <button type="submit" className={tw`text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800`}>
                  Update Profile
              </button>
             
          </div>
        
      </form>
    </div>
    </section>
    <Script src="https://cdn.jsdelivr.net/npm/flowbite@latest/dist/flowbite.js"></Script>
  </>
  
}



const Profile = () => {
  const { user, isLoading } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userDetails, setData] = useState<User>()

  useEffect(() => {
    fetcher<User>('/api/members/me')
        .then(data => setData(data))
            .then(() => setProfile(Object.assign({}, user, userDetails)))
  }, [user, userDetails])
  return (
    <>
      {isLoading ? <p>Loading...</p> : <ProfileCard profile={profile!} />}
    </>
  )
}

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Profile)