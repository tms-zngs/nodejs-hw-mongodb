import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) => {
  return ContactsCollection.find({ userId })
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const deleteContact = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (contactId, payload, userId) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
};
